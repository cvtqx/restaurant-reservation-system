/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */


const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").post(controller.create).get(controller.list).all(methodNotAllowed);

module.exports = router;