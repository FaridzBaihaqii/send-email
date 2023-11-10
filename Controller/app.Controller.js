const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const { EMAIL, PASSWORD } = require('../env.js');

/* untuk Mengirim Email dari akun Pengujian. */
const signup = async (req, res) => {

    /* Testing akun */
    let testAccount = await nodemailer.createTestAccount();

    // Membuat objek transporter yang dapat digunakan kembali menggunakan transport SMTP default
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
       user: testAccount.user, // Pengguna halus yang dibuat ulang
       pass: testAccount.pass, // Kata sandi halus yang dihasilkan
    },
  });

  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // Alamat Pengirim
    to: "bar@example.com, baz@example.com", // Daftar Penerima
    subject: "Hello ✔", // Garis subjek
    text: "Jika saya berhasil Mendaftar dengan.",
    html: "<b>Jika saya berhasil Mendaftar dengan.</b>", 
  }


  transporter.sendMail(message).then((info) => {
    return res.status(201)
    .json({
         msg: "Anda harus menerima email",
         info : info.messageId,
         preview: nodemailer.getTestMessageUrl(info)
        })
  }).catch(error => {
    return res.status(500).json({ error })
  })

    // res.status(201).json("Login Berhasil..!");
}

/* Kirim Email dari akun Gmail asli. */
const getbill = (req, res) => {

    const { userEmail } = req.body;

    let config = {
        service : 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Muhammad Faridz Baihaqi",
            link: 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : "muhammadfaridz",
            intro: "Terimakasih atas Pembelian Anda di RizuStore",
            table : {
                data : [
                    {
                        Barang : "Senda Jepit Swallow",
                        Pembayaran : "BCA",
                        Harga : "Rp. 400,000",
                        Kembali: "http://localhost:5174/"
                  }
                ]
            },
            outro: "Makasih Udah Boleh dicoba emailnya"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : userEmail,
        subject: "Akan DiPesan",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "Anda seharusnya menerima email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("getBill Berhasil..!");
}

module.exports = {
    signup,
    getbill
}