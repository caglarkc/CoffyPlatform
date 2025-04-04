const AdminAuthService = require('../services/admin.auth.service');

class AdminAuthController {

    async createCreator(req, res) {
        try {
            const result = await AdminAuthService.createCreator(req.body.key);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async createAdmin(req, res) {
        try {
            const loggedAdmin = req.admin;

            const admin = await AdminAuthService.createAdmin(req.body, loggedAdmin);
            return res.status(201).json(admin);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    

    async checkPhone(req, res) {
        try {
            const message = await AdminAuthService.checkPhone(req.query);
            return res.status(200).json(message);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async checkEmail(req, res) {
        try {
            const message = await AdminAuthService.checkEmail(req.query);
            return res.status(200).json(message);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async loginAdmin(req, res) {
        try {
            const result = await AdminAuthService.loginAdmin(req.body);
            
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

    async logoutAdmin(req, res) {
        try {
            const adminId = req.admin._id;
            const result = await AdminAuthService.logoutAdmin(adminId);
            
            // Cookie'yi temizle
            res.clearCookie('accessToken');
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAdmin(req,res) {
        try {
            const admin = req.admin;
            const result = await AdminAuthService.getAdmin(admin);
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



    
    async refreshAccessToken(req, res) {
        try {
            const { refreshToken, adminId } = req.body;
            const result = await AdminAuthService.refreshAccessToken(adminId, refreshToken);
            
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

    async cookieRefreshToken(req, res) {
        try {
            const adminId = req.body.adminId;
            const existingRefreshToken = await AdminAuthService.getRefreshToken(adminId);
            
            if (!existingRefreshToken) {
                return res.status(401).json({ message: "Geçersiz refresh token" });
            }
            
            const result = await AdminAuthService.refreshAccessToken(adminId, existingRefreshToken);
            
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

module.exports = new AdminAuthController();