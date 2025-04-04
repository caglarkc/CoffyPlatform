const AdminService = require('../services/admin.service');

class AdminController {
    
    /**
     * Update an admin's name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - Response with updated admin information
     */
    async updateAdminName(req, res) {
        const { adminId } = req.params;
        const { name } = req.body;
        
        if (!adminId || !name) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID and name are required'
            });
        }
        
        const result = await AdminService.updateAdminName(adminId, name);
        return res.status(200).json({
            success: true,
            message: result.message,
            admin: result.admin
        });
    }
}

module.exports = new AdminController();