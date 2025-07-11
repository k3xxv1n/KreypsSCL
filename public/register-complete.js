const params = new URLSearchParams(window.location.search)
const message = params.get('register')

if(message == 'true'){
    document.getElementById("message").textContent='Usuario registrado porfavor logeate'
    document.getElementById("register-a").remove()
}