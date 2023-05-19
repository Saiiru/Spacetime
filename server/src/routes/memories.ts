import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
	app.get('/memories', async () => {
		const memories = await prisma.memory.findMany({
			orderBy: {
				createdAt: 'asc',
			},
		})
		return memories.map((memory) => {
			return {
				id: memory.id,
				coverUrl: memory.coverUrl,
				excerpt: memory.content.substring(0, 160).concat('...'),
				createdAt: memory.createdAt,
			}
		})
	})

	app.get('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})
		const { id } = paramsSchema.parse(request.params)

		const memory = await prisma.memory.findUniqueOrThrow({
			where: { id },
		})
		return memory
	})

	app.post('/memories', async (request) => {
		const bodySchema = z.object({
			coverUrl: z.string(),
			content: z.string(),
			isPublic: z.coerce.boolean().default(false),
		})

		const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

		const memory = prisma.memory.create({
			data: {
				content,
				coverUrl,
				isPublic,
				userId: '873a8f21-ce60-4c2f-9b99-a84f4a2c836c',
			},
		})

		return memory
	})

	app.put('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})
		const { id } = paramsSchema.parse(request.params)

		const bodySchema = z.object({
			coverUrl: z.string(),
			content: z.string(),
			isPublic: z.coerce.boolean().default(false),
		})

		const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

		await prisma.memory.update({
			where: { id },
			data: {
				content,
				coverUrl,
				isPublic,
			},
		})
	})

	app.delete('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})
		const { id } = paramsSchema.parse(request.params)

		await prisma.memory.delete({
			where: { id },
		})
	})
}
