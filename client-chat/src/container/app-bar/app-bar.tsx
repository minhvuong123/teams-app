import { Menu, Badge  } from 'antd';
import { BsChatDots, BsChatDotsFill } from "react-icons/bs";
import { RiTeamLine, RiTeamFill, RiFilePaper2Line} from "react-icons/ri";
import './app-bar.scss';

function AppBar() {
  return (
    <div className="app-bar">
      <Menu mode='inline' defaultSelectedKeys={['1']} >
        <Menu.Item key="1">
          <Badge count={11} overflowCount={10}>
            <span className="bar-icon"><BsChatDots /></span> 
          </Badge>
          Chat 
        </Menu.Item>
        <Menu.Item key="2">
          <Badge count={1} overflowCount={10}>
            <span className="bar-icon"><RiTeamLine /></span> 
          </Badge>
          Teams 
        </Menu.Item>
        <Menu.Item key="3">
          <Badge count={0} overflowCount={10}>
            <span className="bar-icon"><RiFilePaper2Line /></span> 
          </Badge>
          Files 
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default AppBar;
