"use client"
import React, { JSX, useActionState, useState, 
  startTransition, useEffect, useRef } from "react";
import { sendContactEmail } from "./FormActions";

export default function Contact(): JSX.Element {
  const [clientError, setClientError] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(sendContactEmail as (prevState: any, formData: FormData) => Promise<any>, {
    success: false,
    fallbackToMailto: false,
    error: null,
  });


  useEffect(() => {
    if (state.fallbackToMailto && state.validatedData) {
      const { firstName, lastName, email, message } = state.validatedData;

      const yourInbox = "dadigwu@gmail.com";
      const subject = encodeURIComponent(`New E-Commerce Message ${firstName} ${lastName}`);
      const body = encodeURIComponent(
        `Hi, our messaging server was busy, so this notification is routing natively!\n\n` +
        `Sender: ${firstName} ${lastName} (${email})\n\n` +
        `Message:\n${message}`
      );

      // Instantly open the client's local app with their form inputs pre-filled
      window.location.href = `mailto:${yourInbox}?subject=${subject}&body=${body}`;
    }
  }, [state.fallbackToMailto, state.validatedData]);


  // ACCESSIBILITY: Shift focus to the banner notifications when validation finishes
  useEffect(() => {
    if(clientError || state.error || state.success || state.fallbackToMailto) {
      bannerRef.current?.focus();
    }
  }, [clientError, state.error, state.success, state.fallbackToMailto]);

  const checkFormSubmission = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError(null);

    // Pass data to the backend
    const currentForm = event.currentTarget;
    startTransition(() => {
      formAction(new FormData(currentForm));
    });
  }

  const hasActiveError = !!(clientError || state.error);

  return(
    <main className="contact-container">
      <section id="contact-form-container" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="contact-headline">Contact Us</h2>
        
        <form onSubmit={checkFormSubmission} className="contact-form">

          {(clientError || state.error || state.success || state.fallbackToMailto) && (
            <div 
              ref={bannerRef}
              id="form-status-banner"
              role={hasActiveError ? "alert" : "status"}
              aria-live="polite"
              tabIndex={-1}
              style={{ outline: "none" }}
            >
              {(clientError || state.error) && (
                <div className="error-banner" style={{ color: "red", marginBottom: "1rem" }}>
                  {clientError || state.error}
                </div>
              )}

              {state.success && (
                <div className="success-banner" style={{ color: "green", marginBottom: "1rem" }}>
                  Message Sent Successfully!
                </div>
              )}
              
              {state.fallbackToMailto && (
                <div className="warning-banner" style={{ color: "orange", marginBottom: "1rem" }}>
                  ✉ Routing message through your local email application. Please hit "Send" in the window that opened!
                </div>
              )}
            </div>
          )}

          <div className="name-container form-data-containers">
            <div className="first-name-container">
              <label htmlFor="contact-first-name">First Name</label>
              <input 
                type="text" 
                name="contact-first-name" 
                id="contact-first-name"  
                placeholder="First Name" 
                className="input"
                aria-invalid={hasActiveError}
                aria-describedby={hasActiveError ? "form-status-banner" : undefined}
              />
            </div>
            <div className="last-name-container">
              <label htmlFor="contact-last-name">Last Name</label>
              <input 
                type="text" 
                name="contact-last-name" 
                id="contact-last-name"  
                placeholder="Last Name" 
                className="input"
                aria-invalid={hasActiveError}
                aria-describedby={hasActiveError ? "form-status-banner" : undefined}
              />
            </div>
          </div>
          <div className="email-container form-data-containers">
            <label htmlFor="contact-email">Email</label>
            <input 
              type="email" 
              name="contact-email" 
              id="contact-email"  
              placeholder="Email" 
              className="input"
              aria-invalid={hasActiveError}
              aria-describedby={hasActiveError ? "form-status-banner" : undefined}
            />
          </div>
          <div className="message-container form-data-containers">
            <label htmlFor="contact-message">Leave Message</label>
            <textarea 
              name="contact-message" 
              id="contact-message" 
              placeholder="Message"
              aria-invalid={hasActiveError}
              aria-describedby={hasActiveError ? "form-status-banner" : undefined}
            ></textarea>
          </div>

          <button 
            id="contact-submit"
            type="submit"
            disabled={isPending || state.success}
          >
            {isPending ? "Sending Message..." : state.success ? "Message Sent!": "Send Message"}
          </button>
        </form>
      </section>
      
      <div className="contact-banner" aria-hidden="true"></div>
    </main>
  )
}