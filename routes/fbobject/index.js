const express = require('express');
const router = express.Router();
const FB = require('fb');


router.get('/:pageid', (req, res) => {
 const pageId = `${req.params.pageid}/comments`;
 const args = {
   summary: true
 };

 FB.api(pageId, 'get', args, function(response) {
   if(!response || response.error) {
     console.log(!response ? 'error occurred' : response.error);
     return;
   }
   res.json({ 'result' : response.summary.total_count });
 });
});

module.exports = router;
