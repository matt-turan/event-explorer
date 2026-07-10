import { Router, Request, Response } from 'express'
import axios from 'axios'
import { z } from 'zod'
import { db } from '../db'
import { savedEvents } from '../db/schema'
import { eq } from 'drizzle-orm'

const router = Router()

const searchSchema = z.object({
    keyword: z.string().optional(),
    city: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    size: z.coerce.number().int().positive().max(20).optional().default(10),
})

router.get('/search', async (req: Request, res: Response) => {
    const result = searchSchema.safeParse(req.query)

    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() })
        return
    }

    const { keyword, city, page, size } = result.data

    try {
        const response = await axios.get(
            'https://app.ticketmaster.com/discovery/v2/events.json',
            {
                params: {
                    apikey: process.env.TICKETMASTER_API_KEY,
                    keyword,
                    city,
                    page: page - 1,
                    size,
                    sort: 'date,asc',
                }
            }
        )

        const data = response.data
        const events = data._embedded?.events ?? []

        const mapped = events.map((event: any) => ({
            id: event.id,
            name: event.name,
            date: event.dates?.start?.localDate,
            time: event.dates?.start?.localTime,
            venue: event._embedded?.venues?.[0]?.name,
            city: event._embedded?.venues?.[0]?.city?.name,
            country: event._embedded?.venues?.[0]?.country?.name,
            image: event.images?.[0]?.url,
            url: event.url,
            minPrice: event.priceRanges?.[0]?.min,
            maxPrice: event.priceRanges?.[0]?.max,
            category: event.classifications?.[0]?.segment?.name,
        }))

        res.json({
            events: mapped,
            total: data.page?.totalElements ?? 0,
            totalPages: data.page?.totalPages ?? 0,
            page: data.page?.number ?? 0,
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' })
    }
})


const saveEventSchema = z.object({
    ticketmasterId: z.string(),
    name: z.string(),
    startDate: z.string(),
    venue: z.string().optional(),
    city: z.string().optional(),
    imageUrl: z.string().optional(),
    url: z.string().optional(),
    category: z.string().optional(),
})

router.post('/save', async (req: Request, res: Response) => {
    const result = saveEventSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() })
        return
    }

    try {
        const saved = await db.insert(savedEvents).values({
            ticketmasterId: result.data.ticketmasterId,
            name: result.data.name,
            startDate: new Date(result.data.startDate),
            venue: result.data.venue,
            city: result.data.city,
            imageUrl: result.data.imageUrl,
            url: result.data.url,
            category: result.data.category,
        }).returning()

        res.status(201).json(saved[0])
    } catch (error) {
        res.status(500).json({ error: 'Failed to save event' })
    }
})

router.get('/saved', async (req: Request, res: Response) => {
    try {
        const events = await db.select().from(savedEvents)
        res.json(events)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved events' })
    }
})

router.delete('/saved/:id', async (req: Request, res: Response) => {
    console.log('Delete request received for ID:', req.params.id) // Debugging line
    console.log('Type of ID:', typeof req.params.id) // Debugging line
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID' })
        return
    }

    try {
        await db.delete(savedEvents).where(eq(savedEvents.id, id))
        res.json({ success: true })
    } catch {
        res.status(500).json({ error: 'Failed to delete event' })
    }
})

export default router