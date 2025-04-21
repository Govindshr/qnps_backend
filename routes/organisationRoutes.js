const express = require('express');
const router = express.Router();
const { addOrganisation ,getAllOrganisations ,getOrganisationById ,deleteOrganisationById ,updateOrganisationById} = require('../controllers/organisationController');

router.post('/add', addOrganisation);
router.post('/all', getAllOrganisations);
router.post('/get', getOrganisationById);
router.post('/delete', deleteOrganisationById);
router.post('/update', updateOrganisationById);

module.exports = router;
