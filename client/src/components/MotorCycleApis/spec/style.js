
import { makeStyles } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';

const useStyles = makeStyles((theme)=>({
    container:{
        backgroundColor:theme.palette.background.paper,
        padding:theme.spacing(8,0,6),

    },
    icon:{
        marginRight:"20px",

    },
    button:{
        marginTop:"30px",
        marginBottom:"40px"
    },
    cardGrid:{
        padding:"100px 0",
      

    },
    Grid:{

        padding:"100px 0 "
    },
    ToolBar:{
        backgroundColor:"pink",
    },
    AppBar:{
        backgroundColor:"pink",
    },
    card:{
        display:"flex",
        flexDirection:"column",

    },
    cardMedia:{
        paddingTop:"56.25%",
    },
    cardContent:{
        flexGrow:1,
    },
    
    

}))


export default useStyles;