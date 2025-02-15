import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createStaff,
  getStaffs,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
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
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, staff]
 *           default: staff
 *           description: Only superadmin can change this value
 *         organization:
 *           type: string
 *           description: Organization ID
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/staffs:
 *   post:
 *     summary: Create a new staff member (Superadmin/Admin only)
 *     description: Only superadmin and admin users can create staff members
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, staff]
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router.post('/', auth, createStaff);

/**
 * @swagger
 * /api/staffs:
 *   get:
 *     summary: Get all staffs for current organization
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staffs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', auth, getStaffs);

/**
 * @swagger
 * /api/staffs/{id}:
 *   put:
 *     summary: Update a staff member (Superadmin/Admin only)
 *     description: Only superadmin and admin users can update staff members
 *     tags: [Staffs]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 */
router.put('/:id', auth, updateStaff);

/**
 * @swagger
 * /api/staffs/{id}:
 *   delete:
 *     summary: Delete a staff member (Superadmin/Admin only)
 *     description: Only superadmin and admin users can delete staff members
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', auth, deleteStaff);

export default router; 