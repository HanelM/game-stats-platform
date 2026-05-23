function updateNavbarUser(){

    const username =
        localStorage.getItem("username");

    const navUser =
        document.getElementById("nav-user");

    if(!navUser){
        return;
    }

    if(username){

        navUser.innerText = username;
    }
    else{

        navUser.innerText = "Account";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    updateNavbarUser
);