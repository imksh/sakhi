import React from 'react'
import styles from "./NoChat.module.css"

export const NoChat = ({name}) => {
  return (
    <div className={styles.container} >
      <figure>
        <img src="/logo.png" alt="logo"  className="animate-bounce"/>
      </figure>
      <h2>Sakhi</h2>
      <p>{name}</p>
    </div>
  )
}
