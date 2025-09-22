import {useEffect,useState} from 'react'
import styles from "./Home.module.css";
import { Sidebar } from '../components/Sidebar';
import { useChatStore } from '../store/useChatStore';
import { Chat } from '../components/Chat';
import { NoChat } from '../components/NoChat';
import { ChatList } from '../components/ChatList';
import { PhoneChat } from '../components/PhoneChat';
import { useThemeStore } from '../store/useThemeStore';

export const Home = () => {
  const{selectedUser} = useChatStore()
  const{theme,setTheme} = useThemeStore()
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if(width<700){
    return(
      <div className={styles.phoneContainer}>
        {
          selectedUser===null?
          <div className={styles.sidebar}>
        <ChatList />
      </div>
      :
          <div  className={styles.main}>
          {<PhoneChat />}
      </div>
        }
      
    </div>
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.sidebar} style={{backgroundColor:theme}}>
        <Sidebar />
      </div>
      <div  className={styles.main}>
          {selectedUser!=null?<Chat /> : <NoChat name="End to End Encrypted" />}
      </div>
    </div>
  )
}
