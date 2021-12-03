import adminPageHelper from './admin-page-helper';

/**
 * Delete user information (either healer or client)
 * At this point, used to delete healers from the healer list displayed on the admin's panel.
 */

const deleteUserProfile = async(req, res, next) => {
    try{
        const { uid } = req.query;
        const deletedUser = await adminPageHelper.deleteUser(
            uid
        );
        res.status(200).json(deletedUser);
    } catch(err){
        next(err);
    }
    
    // const [rowCount] = await db.User.destroy({
    //     where: {
    //         uid: uid,
    //     },
    //     returning: true,
    // });
    // if(rowCount <= 0){
    //     throw new NotFound();
    // }
};


/**
 * Implement a task manager dashboard for admin
 * Admin can create, update, and delete tasks on their dashboard.
 */

//const createTask;

//const updateTask;

//const deleteTask;

export default {
    deleteUserProfile
    //createTask
    //updateTask
    //deleteTask
};