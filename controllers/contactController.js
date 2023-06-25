

const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const validator = require('validator');

//@desc Get all contacts
//@route GET /api/contacts
//@access private 
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});


//@desc Create contact
//@route POST /api/contacts/
//@access private 
const createContact = asyncHandler(async (req, res) => {
    console.log("This request body is ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All field are mandonary !");
    }



    if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Invalidate email format")
    }
    const contact = await Contact.create({ name, email, phone, user_id: req.user.id });

    res.status(201).json(contact);
}
);



//@desc Get a contact
//@route GET /api/contacts/:id
//@access private 
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw Error("Contact Not Found");
    }


    res.status(200).json(contact);
});


//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private 
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw Error("Contact Not Found");
    }
   
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All field are mandonary !");
    }

    if (contact.user_id.toString() != req.user.id) {
        res.status(403)
        throw new Error("User don't have permission to update other user contacts");
    }

    if(!validator.isEmail(req.body.email)) {
        res.status(400);
        throw new Error("Invalidate email format")
    }

    const updateContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updateContact);
});



//@desc Detele a contact
//@route DELETE /api/contacts/:id
//@access private 
const deleteContact = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw Error("Contact Not Found");
    }


    if (contact.user_id.toString() != req.user.id) {
        res.status(403)
        throw new Error("User don't have permission to delete other user contacts");
    }


    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});


module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };