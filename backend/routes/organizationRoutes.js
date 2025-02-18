import express from 'express';
import { auth } from '../middleware/auth.js';
import { isSuperAdmin } from '../middleware/superAdmin.js';
import {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  switchOrganization,
  getSettings,
  updateSettings,
  getCurrentOrganization
} from '../controllers/organizationController.js';

const router = express.Router();

/**
 * @swagger
 * /api/organizations/current:
 *   get:
 *     summary: Get the current organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/current', auth, getCurrentOrganization);

/**
 * @swagger
 * /api/organizations/settings:
 *   get:
 *     summary: Get organization settings
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/settings', auth, getSettings);

/**
 * @swagger
 * /api/organizations/settings:
 *   put:
 *     summary: Update organization settings
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/settings', auth, updateSettings);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization (Super Admin only)
 *     tags: [Organizations]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
router.post('/', auth, isSuperAdmin, createOrganization);

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, isSuperAdmin, getOrganizations);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get organization by ID (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', auth, isSuperAdmin, getOrganization);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update organization (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, isSuperAdmin, updateOrganization);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Delete organization (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, isSuperAdmin, deleteOrganization);

/**
 * @swagger
 * /api/organizations/{id}/switch:
 *   post:
 *     summary: Switch to organization (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/switch', auth, isSuperAdmin, switchOrganization);

export default router; 