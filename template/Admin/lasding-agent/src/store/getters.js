const getters = {
  themeColor: state => state.app.themeColor,
  themeType: state => state.app.themeType,
  asideTheme: state => state.app.asideTheme,
  navTextColor: state => state.app.navTextColor,
  navTextActiveColor: state => state.app.navTextActiveColor,
  fixedHeader: state => state.app.fixedHeader,
  fixedMenu: state => state.app.fixedMenu,
  showMenu: state => state.app.showMenu,
  token: state => state.user.token,
  userMenu: state => state.user.userMenu,
  nickname: state => state.user.nickname
}

export default getters
