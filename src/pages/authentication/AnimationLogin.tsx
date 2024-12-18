import { useEffect } from "react";

export default function animationLogin(): void {
    // Usa referencias del DOM de manera más segura para React
    useEffect(() => {
      const sign_in_btn = document.querySelector('#sign-in-btn');
      const sign_up_btn = document.querySelector('#sign-up-btn');
      const container = document.querySelector('.container');
  
      if (sign_up_btn && container) {
        sign_up_btn.addEventListener('click', () => {
          container.classList.add('sign-up-mode');
        });
      }
  
      if (sign_in_btn && container) {
        sign_in_btn.addEventListener('click', () => {
          container.classList.remove('sign-up-mode');
        });
      }
  
      // Opcional: limpia los event listeners
      return () => {
        sign_up_btn?.removeEventListener('click', () => {});
        sign_in_btn?.removeEventListener('click', () => {});
      };
    }, []); // Array vacío para que se ejecute solo una vez
  }

