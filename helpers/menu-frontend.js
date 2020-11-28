
const getMenuFrontEnd = ( role = 'USER_ROLE') => {

    const menu = [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          submenu: [
            {
              titulo: 'Main',
              path: '/'
            },
            {
              titulo: 'Progress Bar',
              path: 'progress',
            },
            {
              titulo: 'Gráficas',
              path: 'grafica1'
            },
            {
              titulo: 'Promesas',
              path: 'promesas'
            },
            {
              titulo: 'RXJS',
              path: 'rxjs'
            }
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            /* {
              titulo: 'Usuarios',
              path: 'usuarios'
            }, */
            {
              titulo: 'Hospitales',
              path: 'hospitales',
            },
            {
              titulo: 'Medicos',
              path: 'medicos'
            },
          ]
        },
      ];

    if ( role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({
            titulo: 'Usuarios',
            path: 'usuarios'
        });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}