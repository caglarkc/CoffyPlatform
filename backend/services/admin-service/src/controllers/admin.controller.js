const AdminService = require('../services/admin.service');

class AdminController {
    
    
    /**
     * Auth servisi ile iletişimi test et
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async testAuthCommunication(req, res) {
        try {
            const testData = req.body || { test: "default-test-data" };
            const result = await AdminService.testCommunication(testData);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ 
                success: false,
                message: "İletişim testi başarısız oldu",
                error: error.message 
            });
        }
    }

    /**
     * Admin bilgilerini getir
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAdmin(req, res) {
        try {
            // req.adminId middleware tarafından ekleniyor
            const adminId = req.adminId;
            
            // AdminId yoksa hata döndür
            if (!adminId) {
                return res.status(401).json({
                    success: false,
                    message: "Admin ID bulunamadı. Lütfen giriş yapın."
                });
            }
            
            // Admin bilgilerini getir
            const result = await AdminService.getAdmin(adminId);
            return res.status(200).json(result);
        } catch (error) {
            // Hata tipine göre uygun HTTP durum kodunu belirle
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    async changeAdminDataMany(req, res) {
        try {
            const adminId = req.adminId;
            const { name, surname, email, phone } = req.body;
            
            // AdminId yoksa hata döndür
            if (!adminId) {
                return res.status(401).json({
                    success: false,
                    message: "Admin ID bulunamadı. Lütfen giriş yapın."
                });
            }

            // En az bir değer girilmiş mi kontrol et
            if (!name && !surname && !email && !phone) {
                return res.status(400).json({
                    success: false,
                    message: "En az bir bilgi alanı güncellenmelidir (name, surname, email, phone)."
                });
            }

            // Boş olmayan değerleri newData objesine ekle
            const newData = {};
            if (name) newData.name = name;
            if (surname) newData.surname = surname; 
            if (email) newData.email = email;
            if (phone) newData.phone = phone;

            // Admin bilgilerini güncelle
            const result = await AdminService.changeAdminDataMany(adminId, newData);
            return res.status(200).json(result);
        } catch (error) {
            // Hata tipine göre uygun HTTP durum kodunu belirle
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ 
                success: false,
                message: "Bilgi güncelleme işlemi başarısız oldu",
                error: error.message 
            });
        }
    }

    async changeAdminDataJustOne(req, res) {
        try {
            const adminId = req.adminId;
            const newData = req.body.newData;
            const type = req.body.type;

            // AdminId yoksa hata döndür
            if (!adminId) {
                return res.status(401).json({
                    success: false,
                    message: "Admin ID bulunamadı. Lütfen giriş yapın."
                });
            }

            // Admin bilgilerini güncelle
            const result = await AdminService.changeAdminDataJustOne(adminId, newData, type);
            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json({ 
                success: false,
                message: "Bilgi güncelleme işlemi başarısız oldu",
                error: error.message 
            });
        }
    }

}

module.exports = new AdminController();