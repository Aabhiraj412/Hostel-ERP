// import React, { useState } from 'react';
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   styled,
//   Typography,
// } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
// import PersonIcon from '@mui/icons-material/Person';
// import EventIcon from '@mui/icons-material/Event';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MenuBookIcon from '@mui/icons-material/MenuBook';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// const drawerWidth = 240;
// const miniDrawerWidth = 60;

// const Anant = styled(Toolbar)`
//   background: rgba(255, 255, 255, 0.2);  /* Transparent white */
//   backdrop-filter: blur(10px);            /* Blurring effect */
//   -webkit-backdrop-filter: blur(10px);    /* Safari support */
//   border: 1px solid rgba(255, 255, 255, 0.3);  /* Optional border */
//   box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);  /* Subtle shadow */
//   border-radius: 12px;                    /* Optional rounded corners */
//   color: black;                           /* Adjust text color for readability */
// `;

// function MiniVariantDrawer() {
//   const [open, setOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//   };

//   const menuItems = [
//     { text: 'Home', icon: <HomeIcon /> },
//     { text: 'Profile', icon: <PersonIcon /> },
//     { text: 'Attendance', icon: <EventIcon /> },
//     { text: 'Notice', icon: <NotificationsIcon /> },
//     { text: 'Menu', icon: <MenuBookIcon /> },
//   ];

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           transition: (theme) =>
//             theme.transitions.create(['width', 'margin'], {
//               easing: theme.transitions.easing.sharp,
//               duration: theme.transitions.duration.leavingScreen,
//             }),
//           marginLeft: open ? drawerWidth : miniDrawerWidth,
//           width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             // color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ marginRight: 2 }}
//           >
//             {open ? <ChevronLeftIcon /> : <MenuIcon />}
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             My Mini Drawer App
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Drawer
//         variant="permanent"
//         sx={{
//           width: open ? drawerWidth : miniDrawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: {
//             width: open ? drawerWidth : miniDrawerWidth,
//             boxSizing: 'border-box',
//             transition: (theme) =>
//               theme.transitions.create('width', {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.leavingScreen,
//               }),
//           },
//         }}
//       >
//         <Toolbar />
//         <List>
//           {menuItems.map((item, index) => (
//             <ListItem button key={index}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               {open && <ListItemText primary={item.text} />}
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>

      
//     </Box>
//   );
// }

// export default MiniVariantDrawer;


import React, { useState } from 'react';
import logo from "@/assets/whiteBlack.svg";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  styled,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const miniDrawerWidth = 60;

const GlassAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.2); 
  backdrop-filter: blur(10px);          
  -webkit-backdrop-filter: blur(10px);  
  border: 1px solid rgba(255, 255, 255, 0.3); 
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); 
`;

const GlassDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
`;

function MiniVariantDrawer(router) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon sx={{fontSize:40}} />, route: router.router.Home },
    { text: 'Profile', icon: <PersonIcon sx={{fontSize:40}}  />, route: router.router.Profile },
    { text: 'Attendance', icon: <EventIcon sx={{fontSize:40}} />, route: router.router.Attendance },
    { text: 'Notice', icon: <NotificationsIcon sx={{fontSize:40}} />, route: router.router.Notice },
    { text: 'Menu', icon: <MenuBookIcon sx={{fontSize:40}} />, route: router.router.Menu },
  ];

  return (
    <Box sx={{ display: 'flex',overflow:'hidden' }}>
      <CssBaseline />
      <GlassAppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: open ? drawerWidth : miniDrawerWidth,
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 2, color: 'black' }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: 'black' }}>
            <img src={logo} className="h-11" alt="Logo" />
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{ color: 'black', fontWeight: 'bold' }}
          >
            {router.router.title}
          </Typography>
        </Toolbar>
      </GlassAppBar>

      <GlassDrawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          overflow:'hidden',
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : miniDrawerWidth,
            boxSizing: 'border-box',
            overflow:'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => navigate(item.route)} 
              sx={{
                cursor: 'pointer',
                justifyContent: open ? 'flex-start' : 'center', 
                alignItems: 'center',
                flexDirection: open ? 'row' : 'column', 
                margin: '20px 0',
                color:'white',
              }}>
                
              <ListItemIcon   sx={{
                justifyContent: 'center',
                fontSize: 30, 
                minWidth: open ? 'auto' : 0,
                marginRight: open ? '16px' : 0, 
                color:'white',
        }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} sx={{ textAlign: 'left'}}/>}
            </ListItem>
          ))}
        </List>
      </GlassDrawer>
    </Box>
  );
}

export default MiniVariantDrawer;
