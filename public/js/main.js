$(document).ready(()=>{
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
    let confirmation = confirm('Are you sure?');
    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('id')
        }).done(()=>{
            window.location.replace('/');
        });
        window.location.replace('/');
        return true;
    }
    else {
        return false;
    }
}