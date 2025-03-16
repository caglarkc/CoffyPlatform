const AdminService = require('../services/admin.service');

class AdminController {
    
    async registerAdmin(req, res) {
        try {
            const admin = await AdminService.registerAdmin(req.body);
            return res.status(201).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async upgradeRole(req, res) {
        try {
            const admin = await AdminService.upgradeRole(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async downgradeRole(req, res) {
        try {
            const admin = await AdminService.downgradeRole(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteAdmin(req, res) {
        try {
            const admin = await AdminService.deleteAdmin(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async checkPhone(req, res) {
        try {
            const admin = await AdminService.checkPhone(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async checkEmail(req, res) {
        try {
            const admin = await AdminService.checkEmail(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateAdmin(req, res) {
        try {
            const admin = await AdminService.updateAdmin(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async changeLocation(req, res) {
        try {
            const admin = await AdminService.changeLocation(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async loginAdmin(req, res) {
        try {
            const admin = await AdminService.loginAdmin(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async refreshAccessToken(req, res) {
        try {
            const admin = await AdminService.refreshAccessToken(req.body);
            return res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();