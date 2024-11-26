const db = require("../db");
const bcrypt = require("bcryptjs");
const emailSender = require("../mailer"); 

const getPoints = (req, res) => { 
  const email = req.body.email;
  const q = "SELECT points FROM users WHERE `email`= ?";


  db.query(q, [email], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
};

const editUser =  async (req, res)  => { 
  const id = req.body.user.id;
  const email = req.body.user.email;
  const name = req.body.user.name;
  const pass = req.body.user.pass;
  const passRep = req.body.user.passRep;

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if ( !name ) {return res.json({ message: "You must have a nick!" });}
  if ( !email ) {return res.json({ message: "You must have an email!" });}


  if((email && name) && (!pass && !passRep)) {

    if ( name.length > 25 ) {return res.json({ message: "Name cannot be longer than 25 characters !" });}
    else if (!emailRegex.test(email)) {return res.json({ message: "Wrong email format !" })}
    else {
      const q = "UPDATE users SET `name`= ?, `email`= ? WHERE `id`= ? ";
      db.query(q, [name,email,id], (err, data) => {
        if (err) return res.send(err);

        let random = Math.floor(Math.random() * 11)
        emailSender(email, 'You have updated your profile', `Your profile was updated ${name}!\n\nAdmin and Developer of HackTheMaturita`);
        if ( random <= 2 ) {
            return res.json({ messageGreen: "These changes will take effect after you log in."  });
        } else if ( random <= 4 ) {
            return res.json({ messageGreen: "Your profile will be updated after you log out."  });
        } else if ( random <= 6 ) {
            return res.json({ messageGreen: "The profile updates after logging out."  });
        } else if ( random <= 8 ) {
            return res.json({ messageGreen: "Log out to see the current changes."  });
        } else {
            return res.json({ messageGreen: "You will see the changes after logging out."  });
        }
      });
    } 
  }

  if (pass || passRep) {

    if (pass == passRep) {

      if ( pass.length < 7) {return res.json({ message: "Password must have 7+ chars" });} 

      let hashedPassword = await bcrypt.hash(passRep, 8);
      const q = "UPDATE users SET `name`= ?, `email`= ?, `password`= ? WHERE `id`= ? ";

      db.query(q, [name,email,hashedPassword,id], (err, data) => {
        if (err) return res.send(err);

        let random = Math.floor(Math.random() * 11)
        if ( random <= 2 ) {
            return res.json({ messageGreen: "Changes will take effect after logging in"  });
        } else if ( random <= 4 ) {
            return res.json({ messageGreen: "Your profile will be updated after logging out"  });
        } else if ( random <= 6 ) {
            return res.json({ messageGreen: "You will see changes after logging out"  });
        } else if ( random <= 8 ) {
            return res.json({ messageGreen: "Log out to see the current changes"  });
        } else {
            return res.json({ messageGreen: "Profile will be updated after logging out"  });
        }
      });
    }

    else if (!pass || !passRep) {
      return res.json({ message: "You must repeat the password !"  });
    }

    else{
      return res.json({message: "Passwords are not matching !"});
    }
  }

};

module.exports = {
    getPoints,
    editUser
};
  
