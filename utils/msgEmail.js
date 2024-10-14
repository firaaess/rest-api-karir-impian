import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "info.karir.impian@gmail.com",
      pass: "kyih dpog idol gyer",
    },
  });

  export const joinWeb = async (email, fullname)=> {
    try {
        const info = await transporter.sendMail({
            from: '"Karir-Impian" <info.karir.impian@gmail.com>', // alamat pengirim
            to: email, // daftar penerima
            subject: `Selamat Datang di Karir-Impian, ${fullname}`, // Subjek email
            text: `Selamat datang, ${fullname}! Terima kasih telah bergabung di Karir-Impian.`, // teks biasa
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="background-color: #007bff; color: white; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0;">Selamat Datang, ${fullname}!</h1>
                  </div>
                  <div style="padding: 20px;">
                    <p>Terima kasih telah mendaftar. Kami sangat senang menyambut Anda ke dalam komunitas kami.</p>
                    <p>Mulailah menjelajahi berbagai kesempatan karir dan sumber daya yang kami tawarkan.</p>
                    <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami di <a href="mailto:info.karir.impian@gmail.com" style="color: #007bff;">info.karir.impian@gmail.com</a>.</p>
                    <p>Selamat berpetualang dalam mencari karir impian Anda!</p>
                    <p>Salam hangat,<br>Tim Karir-Impian</p>
                  </div>
                </div>
              </div>
            `, // body HTML
          });          
          console.log(info)
    } catch (error) {
        console.log(error)
    }
  }