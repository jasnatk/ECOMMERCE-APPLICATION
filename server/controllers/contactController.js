exports.handleContactForm = (req, res) => {
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      email,
      message
    } = req.body;
  
    console.log("📬 Contact Form Submission:");
    console.log("Name:", firstName, lastName);
    console.log("Address:", address, city, state);
    console.log("Email:", email);
    console.log("Message:", message);
  
    // You can add database save or email logic here
  
    res.status(200).json({ message: "Message received successfully." });
  };
  