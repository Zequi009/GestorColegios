const btnToggleSidebar = document.getElementById("btnToggleSidebar");
const sidebar = document.getElementById("sidebar");

btnToggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});