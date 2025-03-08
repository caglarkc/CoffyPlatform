// RegisterActivity.kt - Kotlin ile kayıt ekranı örneği
package com.coffy.ui.auth

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.coffy.R
import com.coffy.databinding.ActivityRegisterBinding
import com.coffy.services.AuthService
import com.coffy.services.RegisterRequest
import com.coffy.utils.ValidationUtils
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private val authService = AuthService()
    private val TAG = "RegisterActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
    }

    private fun setupListeners() {
        // Kayıt ol butonuna tıklama
        binding.btnRegister.setOnClickListener {
            if (validateInputs()) {
                registerUser()
            }
        }

        // Giriş yap sayfasına yönlendirme
        binding.tvLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun validateInputs(): Boolean {
        val name = binding.etName.text.toString().trim()
        val surname = binding.etSurname.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val phone = binding.etPhone.text.toString().trim()
        val password = binding.etPassword.text.toString()
        val confirmPassword = binding.etConfirmPassword.text.toString()

        // İsim validasyonu
        try {
            ValidationUtils.validateName(name)
            binding.tilName.error = null
        } catch (e: Exception) {
            binding.tilName.error = e.message
            return false
        }

        // Soyisim validasyonu
        try {
            ValidationUtils.validateSurname(surname)
            binding.tilSurname.error = null
        } catch (e: Exception) {
            binding.tilSurname.error = e.message
            return false
        }

        // Email validasyonu
        try {
            ValidationUtils.validateEmail(email)
            binding.tilEmail.error = null
        } catch (e: Exception) {
            binding.tilEmail.error = e.message
            return false
        }

        // Telefon validasyonu
        try {
            ValidationUtils.validatePhone(phone)
            binding.tilPhone.error = null
        } catch (e: Exception) {
            binding.tilPhone.error = e.message
            return false
        }

        // Şifre validasyonu
        try {
            ValidationUtils.validatePassword(password)
            binding.tilPassword.error = null
        } catch (e: Exception) {
            binding.tilPassword.error = e.message
            return false
        }

        // Şifre eşleşme kontrolü
        if (password != confirmPassword) {
            binding.tilConfirmPassword.error = "Şifreler eşleşmiyor"
            return false
        } else {
            binding.tilConfirmPassword.error = null
        }

        return true
    }

    private fun registerUser() {
        val name = binding.etName.text.toString().trim()
        val surname = binding.etSurname.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val phone = binding.etPhone.text.toString().trim()
        val password = binding.etPassword.text.toString()

        // Yükleniyor göstergesi
        binding.progressBar.visibility = View.VISIBLE
        binding.btnRegister.isEnabled = false

        // Coroutine ile asenkron API çağrısı
        lifecycleScope.launch {
            try {
                val request = RegisterRequest(name, surname, email, phone, password)
                val response = authService.register(request)

                binding.progressBar.visibility = View.GONE
                binding.btnRegister.isEnabled = true

                if (response.success) {
                    // Başarılı kayıt
                    showSuccessDialog(email)
                } else {
                    // Başarısız kayıt
                    Toast.makeText(this@RegisterActivity, response.message, Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                binding.progressBar.visibility = View.GONE
                binding.btnRegister.isEnabled = true
                
                Log.e(TAG, "Kayıt hatası", e)
                Toast.makeText(this@RegisterActivity, e.message ?: "Kayıt sırasında bir hata oluştu", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun showSuccessDialog(email: String) {
        AlertDialog.Builder(this)
            .setTitle("Kayıt Başarılı")
            .setMessage("Hesabınız oluşturuldu. E-posta adresinizi doğrulamak için bir kod gönderilecek.")
            .setPositiveButton("Tamam") { _, _ ->
                // E-posta doğrulama ekranına yönlendir
                val intent = Intent(this, VerifyEmailActivity::class.java)
                intent.putExtra("email", email)
                startActivity(intent)
                finish()
            }
            .setCancelable(false)
            .show()
    }
} 