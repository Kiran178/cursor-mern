import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createClient,
  getClients,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - firstName
 *         - phone
 *         - organization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           description: Optional email address
 *         phone:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             pincode:
 *               type: string
 *         organization:
 *           type: string
 *           description: Organization ID
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         notes:
 *           type: string
 *         preferredStaff:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Staff IDs
 *         priorityScore:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *           description: Priority score for appointment scheduling (1-10)
 *         preferredDaysServices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Service IDs
 *           description: Mapping of preferred days to preferred services
 *         monthlySlotAllocation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *                 description: Service ID
 *               slots:
 *                 type: number
 *                 minimum: 1
 *                 default: 10
 *                 description: Number of monthly slots allocated for this service
 *           description: Monthly appointment slot allocation per service
 */

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client (Superadmin/Admin only)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     description: Only superadmin and admin users can create new clients
 */
router.post('/', auth, createClient);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients for current organization
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, getClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client (Superadmin/Admin only)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     description: Only superadmin and admin users can update clients
 */
router.put('/:id', auth, updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client (Superadmin/Admin only)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     description: Only superadmin and admin users can delete clients
 */
router.delete('/:id', auth, deleteClient);

export default router; 