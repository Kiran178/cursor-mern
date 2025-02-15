import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createService,
  getServices,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *         - organization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         organization:
 *           type: string
 *           description: Organization ID
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Superadmin/Admin only)
 *     description: Only superadmin and admin users can create services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 */
router.post('/', auth, createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services for current organization
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service (Superadmin/Admin only)
 *     description: Only superadmin and admin users can update services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 */
router.put('/:id', auth, updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service (Superadmin/Admin only)
 *     description: Only superadmin and admin users can delete services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', auth, deleteService);

export default router; 