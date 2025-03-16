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
            const loggedAdmin = req.admin;

            const admin = await AdminService.upgradeRole(req.body, loggedAdmin);
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
            const result = await AdminService.loginAdmin(req.body);
            
            // Access token'ı güvenli cookie olarak ekle - normal login durumu
            if (result.tokenPair && result.tokenPair.accessToken) {
                res.cookie('accessToken', result.tokenPair.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 900000 // 15 dakika (15 * 60 * 1000 ms)
                });
                
                // Response'a token'ı eklemiyoruz, sadece cookie olarak gönderiyoruz
                delete result.tokenPair.accessToken;
            }
            // Eğer token otomatik yenilendiyse cookie'yi güncelle
            else if (result.accessToken) {
                res.cookie('accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 900000 // 15 dakika
                });
                
                // Response'a token'ı eklemiyoruz
                delete result.accessToken;
            }
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async refreshAccessToken(req, res) {
        try {
            const { refreshToken, adminId } = req.body;
            const result = await AdminService.refreshAccessToken(adminId, refreshToken);
            
            // Yenilenen access token'ı cookie olarak ayarla
            if (result.accessToken) {
                res.cookie('accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 900000 // 15 dakika
                });
                
                // Response'a token'ı eklemiyoruz
                delete result.accessToken;
            }
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async logoutAdmin(req, res) {
        try {
            const adminId = req.admin._id;
            const result = await AdminService.logoutAdmin(adminId);
            
            // Cookie'yi temizle
            res.clearCookie('accessToken');
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // controllers/admin.controller.js içine ekleyin
    async checkCookie(req, res) {
        try {
            if (req.cookies && req.cookies.accessToken) {
                return res.status(200).json({ 
                    hasCookie: true, 
                    cookieValue: "Güvenlik nedeniyle gizlendi",
                    cookieExists: true
                });
            } else {
                return res.status(200).json({ 
                    hasCookie: false, 
                    message: "Cookie bulunamadı" 
                });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async cookieRefreshToken(req, res) {
        try {
            const adminId = req.body.adminId;
            const existingRefreshToken = await AdminService.getRefreshToken(adminId);
            
            if (!existingRefreshToken) {
                return res.status(401).json({ message: "Geçersiz refresh token" });
            }
            
            const result = await AdminService.refreshAccessToken(adminId, existingRefreshToken);
            
            // Yenilenen access token'ı cookie olarak ayarla
            if (result.accessToken) {
                res.cookie('accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 900000 // 15 dakika
                });
                
                // Response'a token'ı eklemiyoruz
                delete result.accessToken;
            }
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();