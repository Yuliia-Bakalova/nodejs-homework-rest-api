
const {Contacts} = require("../models/contacts")

async function getContacts(req, res) {
 const { limit = 10, page = 1, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (favorite) {
    const favoriteContacts = await Contacts.find({ favorite: true });
    return res.status(200).json(favoriteContacts);
  }

  const contacts = await Contacts.find().skip(skip).limit(limit);
  return res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);

    if (!contact) {
        return res.status(404).json({ message: "Not found" });
    }
  return res.status(200).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite  } = req.body;
  const newContact = await Contacts.create({ name, email, phone, favorite });
  return res.status(201).json(newContact);
  
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  if (!contact) {
   return res.status(404).json({ message: "Not found" });
  }
  await Contacts.findByIdAndRemove(contactId);
    res.status(200).json(contact);
};

async function updateContacts(req, res, next) {
  const { contactId } = req.params;
  const body = req.body;
  const contact = await Contacts.findByIdAndUpdate(contactId, body, {
      new: true,
    });
  if (!contact) {
      return res.status(400).json({ message: "Not found" });
      }
  return res.status(200).json(contact);
};

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const body = req.body;
  
  const contact = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!contact) {
      return res.status(400).json({ message: "Not found" });
  }
   return res.status(200).json(contact);
};

module.exports = { getContact, getContacts, deleteContact, createContact, updateContacts, updateStatusContact };  
      