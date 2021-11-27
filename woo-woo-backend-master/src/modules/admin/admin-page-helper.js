import { NotFound } from "../general/middlewares/error-handle-middleware/error-code";
import db from "../general/models";

/**
 * Delete user information (either healer or client)
 * At this point, used to delete healers from the healer list displayed on the admin's panel.
 */

const deleteUser = async({ uid }) => {
    const [rowCount] = await db.User.destroy({
        where: {
            uid: uid,
        },
        returning: true,
    });
    if(rowCount <= 0){
        throw new NotFound();
    }
};


/**
 * Implement a task manager dashboard for admin
 * Admin can create, update, and delete tasks on their dashboard.
 */

//const createTask;

//const updateTask;

//const deleteTask;

export default {
    deleteUser
    //createTask
    //updateTask
    //deleteTask
};