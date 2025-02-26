// src/services/projects/index.js
import { getProjects, getProject } from './getProjects';
import { createProject } from './createProject';
import { updateProject } from './updateProject';
import { deleteProject } from './deleteProject';
import { getCompleteProject } from './getCompleteProject';

/**
 * Projects API module for interacting with project data
 */
export const projectsApi = {
  /**
   * Get all projects for the current user
   * @returns {Promise<{data?: any[], error?: Error}>}
   */
  getAllProjects: async () => {
    return await getProjects();
  },
  
  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<{data?: any, error?: Error}>}
   */
  getProjectById: async (id) => {
    return await getProject(id);
  },
  
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<{data?: any, error?: Error}>}
   */
  createProject: async (projectData) => {
    return await createProject(projectData);
  },
  
  /**
   * Update an existing project
   * @param {string} id - Project ID
   * @param {Object} updates - Project updates
   * @returns {Promise<{data?: any, error?: Error}>}
   */
  updateProject: async (id, updates) => {
    return await updateProject(id, updates);
  },
  
  /**
   * Delete a project and all related data
   * @param {string} id - Project ID
   * @returns {Promise<{success?: boolean, error?: Error}>}
   */
  deleteProject: async (id) => {
    return await deleteProject(id);
  },
  
  /**
   * Get complete project data including chapters, items and internal control
   * @param {string} id - Project ID
   * @returns {Promise<{data?: any, error?: Error}>}
   */
  getCompleteProject: async (id) => {
    return await getCompleteProject(id);
  }
};