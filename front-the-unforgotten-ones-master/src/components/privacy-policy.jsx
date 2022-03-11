/**  
 
*/
import React, { useState } from 'react';
import Copyright from './copyright.jsx';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import PageTitle from './comps/pgTitle.jsx';
import PropTypes from 'prop-types';
import backgroundImage from '../media/background.jpeg';
import globalStyles from './comps/globalStyling.module.css';

const useStyles = makeStyles((theme) => ({
  place: {
    margin: 0,
  },
}));

const listItem = `li p {
  margin: 0.5em;
}`;

const PageContent = (props) => {
  const classes = useStyles();

  return (
    <div style={{ width: '100%' }}>
      <style>{listItem}</style>
      <h2>1. DEFINITIONS</h2>
      <p>
        Undefined terms in this Privacy Policy have the same definition as in
        our 
        <a
          href="https://www.airbnb.ca/help/article/2908"
          target="blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
         (“<strong>Terms</strong>”).
      </p>
      <h2>2. PERSONAL INFORMATION WE COLLECT</h2>
      <h3>2.1 Information needed to use the Woo Woo Network Platform.</h3>
      <p>
        We collect personal information about you when you use the Woo Woo
        Network Platform. Without it, we may not be able to provide you with all
        services requested. This information includes:
      </p>
      <ul>
        <li>
          <p>
            <strong>Contact Information, Account, Profile Information.</strong>{' '}
            Such as your first name, last name, phone number, postal address,
            email address, date of birth, and profile photo, some of which will
            depend on the features you use.
          </p>
        </li>
        <li>
          <p>
            <strong>Identity Verification and Payment Information.</strong> Such
            as images of your government issued ID (as permitted by applicable
            laws), your ID number or other 
            <a
              href="https://www.airbnb.ca/help/article/1237/verifying-your-identity"
              target="blank"
              rel="noreferrer"
            >
              verification
            </a>
             information, bank account or payment account information.
          </p>
        </li>
      </ul>
      <h3>2.2 Information you choose to give us.</h3>
      <p>
        You can choose to provide us with additional personal information. This
        information may include:
      </p>
      <ul>
        <li>
          <p>
            <strong>Additional Profile Information.</strong> Such as gender,
            preferred language(s), city, and personal description. Some of this
            information as indicated in your account settings is part of your
            public profile page and will be publicly visible.
          </p>
        </li>
        <li>
          <p>
            <strong>Address Book Contact Information.</strong> Address book
            contacts you import or enter manually.
          </p>
        </li>
        <li>
          <p>
            <strong>Other Information.</strong> Such as when you fill in a form,
            add information to your account, respond to surveys, post to
            community forums, participate in promotions, communicate with our
            customer care team and other Members, or share your experience with
            us. This may include health information if you choose to share it
            with us.
          </p>
        </li>
      </ul>
      <h3>
        2.3 Information Automatically Collected by Using the Woo Woo Network
        Platform and our Payment Services.
      </h3>
      <p>
        When you use the Woo Woo Network Platform and Payment Services, we
        automatically collect personal information. This information may
        include:
      </p>
      <ul>
        <li>
          <p>
            <strong>Geo-location Information.</strong> Such as precise or
            approximate location determined from your IP address or mobile
            device’s GPS depending on your device settings. We may also collect
            this information when you’re not using the app if you enable this
            through your settings or device permissions.
          </p>
        </li>
        <li>
          <p>
            <strong>Usage Information.</strong> Such as the pages or content you
            view, searches for Listings, bookings you have made, and other
            actions on the Woo Woo Network Platform.
          </p>
        </li>
        <li>
          <p>
            <strong>Log Data and Device Information.</strong> Such as details
            about how you’ve used the Woo Woo Network Platform (including if you
            clicked on links to third party applications), IP address, access
            dates and times, hardware and software information, device
            information, device event information, unique identifiers, crash
            data, cookie data, and the pages you’ve viewed or engaged with
            before or after using the Woo Woo Network Platform. We may collect
            this information even if you haven’t created an Woo Woo Network
            account or logged in.
          </p>
        </li>
        <li>
          <p>
            <strong>
              Cookies and Similar Technologies as described in our 
              <a
                href="https://www.airbnb.ca/help/article/1237/verifying-your-identity"
                target="blank"
                rel="noreferrer"
              >
                Cookie Policy
              </a>
              .
            </strong>
          </p>
        </li>
        <li>
          <p>
            <strong>Payment Transaction Information.</strong> Such as payment
            instrument used, date and time, payment amount, payment instrument
            expiration date and billing postcode, PayPal email address, IBAN
            information, your address and other related transaction details.
          </p>
        </li>
      </ul>
      <h3>2.4 Personal Information We Collect from Third Parties.</h3>
      <p>We collect personal information from other sources, such as:</p>
      <ul>
        <li>
          <p>
            <strong>Third-Party Services.</strong> If you link, connect, or
            login to the Woo Woo Network Platform with a third party service
            (e.g. Google, Facebook, WeChat), you direct the service to send us
            information such as your registration, friends list, and profile
            information as controlled by that service or as authorized by you
            via your privacy settings at that service.
          </p>
        </li>
        <li>
          <p>
            <strong>Background Information.</strong> For Members in the Canada,
            to the extent permitted by applicable laws, we may obtain reports
            from public records of criminal convictions or sex offender
            registrations. For Members outside of the Canada, to the extent
            permitted by applicable laws and with your consent where required,
            we may obtain the local version of police, background or registered
            sex offender checks. We may use your information, including your
            full name and date of birth, to obtain such reports.
          </p>
        </li>
        <li>
          <p>
            <strong>
              Enterprise Product Invitations and Account Management.
            </strong>{' '}
            Organizations that use our Enterprise products may submit personal
            information to facilitate account management and invitations to use
            enterprise products.
          </p>
        </li>
        <li>
          <p>
            <strong>Referrals.</strong>If you are invited to the Woo Woo Network
            Platform such as a signing up to be a healer, the person who you
            invited can submit personal information about you such as your email
            address or other contact information.
          </p>
        </li>
        <li>
          <p>
            <strong>Other Sources.</strong> To the extent permitted by
            applicable law, we may receive additional information about you,
            such as 
            <a
              href="https://www.airbnb.ca/help/article/84/can-i-refer-someone-to-join-airbnb"
              target="blank"
              rel="noreferrer"
            >
              references
            </a>
            , demographic data or information to help detect fraud and safety
            issues from third party service providers and/or partners, and
            combine it with information we have about you. For example, we may
            receive background check results or fraud warnings from identity
            verification service providers for use in our fraud prevention and
            risk assessment efforts. We may receive information about you and
            your activities on and off the Woo Woo Network Platform, or about
            your experiences and interactions from our partners. We may receive
            health information, including but not limited to health information
            related to contagious diseases.
          </p>
        </li>
      </ul>
      <h2>3. HOW WE USE INFORMATION WE COLLECT</h2>
      <p>
        If you reside outside of the Canada click
        <a
          href="https://www.airbnb.ca/help/article/2860/outside-of-the-united-states"
          target="blank"
          rel="noreferrer"
        >
          here
        </a>
         to learn about our legal bases for collection and processing personal
        information.
      </p>
      <p>
        <h3>3.1 Provide, Improve, and Develop the Woo Woo Network Platform.</h3>{' '}
        We use personal information to:
      </p>
      <ul>
        <li>
          <p>
            enable you to access the Woo Woo Network Platform and make and
            receive payments,
          </p>
        </li>
        <li>
          <p>enable you to communicate with other Members,</p>
        </li>
        <li>
          <p>perform analytics, debug and conduct research,</p>
        </li>
        <li>
          <p>provide customer service,</p>
        </li>
        <li>
          <p>
            send you messages, updates, security alerts, and account
            notifications,
          </p>
        </li>
        <li>
          <p>
            if you provide us with your contacts’ information such as your
            fellow colleagues or clients, we may process this information: (i)
            to facilitate your referral invitations, (ii) to share your schedule
            details and facilitate scheduling planning, (iii) for fraud
            detection and prevention, and (iv) to facilitate your requests or
            for any other purpose you authorize,
          </p>
        </li>
        <li>
          <p>
            personalize and customize your experience based on your interactions
            with the Woo Woo Network Platform, your search and booking history,
            your profile information and preferences, and other content you
            submit, and
          </p>
        </li>
        <li>
          <p>enable your use of our enterprise products.</p>
        </li>
      </ul>
      <p>
        <h3>3.2 Create and Maintain a Trusted and Safer Environment.</h3>
        We use personal information to:
      </p>
      <ul>
        <li>
          <p>
            detect and prevent fraud, spam, abuse, security and safety
            incidents, and other harmful activity,
          </p>
        </li>
        <li>
          <p>
            study and combat discrimination consistent with our 
            Nondiscrimination Policy ,
          </p>
        </li>
        <li>
          <p>conduct security investigations and risk assessments,</p>
        </li>
        <li>
          <p>verify or authenticate information provided by you,</p>
        </li>
        <li>
          <p>
            conduct checks against databases and other information sources,
            including background or police checks,
          </p>
        </li>
        <li>
          <p>
            comply with our legal obligations, protect the health and well-being
            of our Clients, Healers, Healers’ employees and members of the
            public,
          </p>
        </li>
        <li>
          <p>resolve disputes with our Members,</p>
        </li>
        <li>
          <p>enforce our agreements with third parties,</p>
        </li>
        <li>
          <p>
            comply with law, respond to legal requests, prevent harm and protect
            our rights (see section 4.5)
          </p>
        </li>
        <li>
          <p>
            enforce our 
            <a
              href="https://www.airbnb.ca/help/article/2908/terms-of-service"
              target="blank"
              rel="noreferrer"
            >
              Terms
            </a>
             and other policies (e.g. 
            <a
              href="https://www.airbnb.ca/help/article/2867/nondiscrimination-policy"
              target="blank"
              rel="noreferrer"
            >
              Nondiscrimination Policy
            </a>
            ), and
          </p>
        </li>
        <li>
          <p>
            in connection with the activities above, we may conduct profiling
            based on your interactions with the Woo Woo Network Platform, your
            profile information and other content you submit to Woo Woo Network,
            and information obtained from third parties. In limited cases,
            automated processes could restrict or suspend access to the Woo Woo
            Network Platform if such processes detect activity that we think
            poses a safety or other risk to Woo Woo Network, our community, or
            third parties. If you would like to challenge the decisioning based
            on the automated process, please contact us via the Contact
            Information section below.
          </p>
        </li>
      </ul>
      <p>
        <h3>
          3.3 Provide, Personalize, Measure, and Improve our Advertising and
          Marketing.
        </h3>
        We may use personal information to:
      </p>
      <ul>
        <li>
          <p>
            send you promotional messages, marketing, advertising, and other
            information based on your preferences and social media advertising
            through social media platforms,
          </p>
        </li>
        <li>
          <p>personalize, measure, and improve our advertising,</p>
        </li>
        <li>
          <p>
            administer referral programs, rewards, surveys, sweepstakes,
            contests, or other promotional activities or events sponsored or
            managed by Woo Woo Network or its third-party partners,
          </p>
        </li>
        <li>
          <p>
            analyze characteristics and preferences to send you promotional
            messages, marketing, advertising and other information that we think
            might be of interest to you, and
          </p>
        </li>
        <li>
          <p>invite you to events and relevant opportunities.</p>
        </li>
      </ul>
      <p>
        <h3>3.4 Provide Payment services.</h3>Personal information is used to
        enable or authorize third parties to use Payment Services:
      </p>
      <ul>
        <li>
          <p>
            Detect and prevent money laundering, fraud, abuse, security
            incidents.
          </p>
        </li>
        <li>
          <p>Conduct security investigations and risk assessments.</p>
        </li>
        <li>
          <p>
            Comply with legal obligations (such as anti-money laundering
            regulations).
          </p>
        </li>
        <li>
          <p>
            Enforce the 
            <a
              href="https://www.airbnb.ca/help/article/2909/payments-terms-of-service"
              target="blank"
              rel="noreferrer"
            >
              Payment Terms
            </a>
             and other payment policies.
          </p>
        </li>
        <li>
          <p>
            With your consent, send you promotional messages, marketing,
            advertising, and other information that may be of interest to you
            based on your preferences.
          </p>
        </li>
        <li>
          <p>Provide and improve the Payment Services.</p>
        </li>
      </ul>
      <h2>4. SHARING &amp; DISCLOSURE</h2>
      <p>
        If you reside outside of the Canada, learn about safeguards we rely on
        for transferring personal information to recipients outside of the EEA 
        <a
          href="https://www.airbnb.ca/help/article/2909/payments-terms-of-service"
          target="blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>
      <h3>4.1 Sharing With Your Consent or at Your Direction.</h3>
      <p>
        Where you provide consent, we share your information as described at the
        time of consent, such as when authorizing a third-party application or
        website to access your Woo Woo Network account or participating in
        promotional activities by Woo Woo Network partners or third parties.
      </p>
      <p>
        Where permissible with applicable law, we may use certain information
        about you, such as your email address, de-identify it, and share it with
        social media platforms, to generate leads, drive traffic to Woo Woo
        Network or otherwise promote our products and services.
      </p>
      <h3>4.2 Sharing Between Members.</h3>
      <p>
        To help facilitate bookings or other interactions between Members, we
        may need to share certain information such as:
      </p>
      <ul>
        <li>
          <p>
            When a booking request is made or dispute is submitted, certain
            information may be shared between Client(s) and Healer, including
            profile, name, names of any additional Clients, cancellation
            history, review information, age of Client (unless prohibited by
            applicable law), dispute outcome (when applicable) and other
            information you choose to share and submit. When a booking is
            confirmed, additional information is shared to assist with
            coordinating the trip, like profile photo and phone number. When you
            as a Healer have a confirmed booking, certain information is shared
            with the Client (and the additional Clients they invite, if
            applicable) to coordinate the booking, such as your profile, full
            name, phone number, and Listing address.
          </p>
        </li>
        <li>
          <p>
            When you as a Healer invite another Member to Healer with you, you
            authorize that person to access and update your information and
            Member Content, including but not limited to certain information
            like your full name, phone number, Accommodation address, calendar,
            Listing information, Listing photos, and email address.
          </p>
        </li>
        <li>
          <p>
            When you as a Client invite additional Clients to a booking, your
            full name, travel dates, Healer name, Listing details, the
            Accommodation address, and other related information will be shared
            with each additional Client.
          </p>
        </li>
      </ul>
      <h3>
        4.3 Information You Publish in Profiles, Listings, and other Public
        Information.
      </h3>
      <p>
        You can make certain information publicly visible to others, such as:
      </p>
      <ul>
        <li>
          <p>
            Your public profile page, which includes your profile photo, first
            name, business name description, and city.
          </p>
        </li>
        <li>
          <p>
            Listing pages that include information such as the approximate or
            precise location description, calendar availability, profile photo,
            and additional information you choose to share.
          </p>
        </li>
        <li>
          <p>Reviews, ratings and other public feedback.</p>
        </li>
      </ul>
      <h3>
        4.5 Complying with Law, Responding to Legal Requests, Preventing Harm
        and Protecting our Rights.
      </h3>
      <p>
        We may disclose your information to courts, law enforcement,
        governmental or public authorities, tax authorities, or authorized third
        parties, if and to the extent we are required or permitted to do so by
        law or where disclosure is reasonably necessary: (i) to comply with our
        legal obligations, (ii) to comply with a valid legal request or to
        respond to claims asserted against Woo Woo Network, (iii) to respond to
        a valid legal request relating to a criminal investigation to address
        alleged or suspected illegal activity, or to respond to or address any
        other activity that may expose us, you, or any other of our users to
        legal or regulatory liability (iv) to enforce and administer our 
        <a
          href="https://www.airbnb.ca/help/article/2908/terms-of-service"
          target="blank"
          rel="noreferrer"
        >
          agreements
        </a>
        with Members, or (v) to protect the rights, property or personal safety
        of Woo Woo Network, its employees, its Members, or members of the
        public. For example, if permitted due to the forgoing circumstances,
        Healer tax information may be shared with tax authorities or other
        governmental agencies.
      </p>
      <p>
        Where appropriate, we may notify Members about legal requests unless:
        (i) providing notice is prohibited by the legal process itself, by court
        order we receive, or by applicable law, or (ii) we believe that
        providing notice would be futile, ineffective, create a risk of injury
        or bodily harm to an individual or group, or create or increase a risk
        of fraud upon or harm to Woo Woo Network, our Members, or expose Woo Woo
        Network to a claim of obstruction of justice.
      </p>
      <p>
        For jurisdictions where Woo Woo Network facilitates the collection and
        remittance of Taxes where legally permissible according to applicable
        law, we may disclose Healers’ and Clients’ information about
        transactions, bookings, Taxes to the applicable tax authority, such as
        Healer and Client names, Listing addresses, transaction dates and
        amounts, tax identification number(s), the amount of taxes received (or
        due) by Healers from Clients, and contact information.
      </p>
      <p>
        In jurisdictions where Woo Woo Network facilitates or requires a
        registration, notification, permit, or license application of a Healer
        with a local governmental authority through Woo Woo Network in
        accordance with local law, we may share information of participating
        Healers with the relevant authority, both during the application process
        and, periodically thereafter, such as the Healer’s full name and contact
        details, location services were offered address, tax identification
        number, Listing details, and number of appointments booked.
      </p>
      <h3>4.6 Programs with Managers and Owners.</h3>
      <p>
        We may share personal information of Healers and Clients such as booking
        information, and information related to compliance with applicable laws.
      </p>
      <h3>4.8 Service Providers.</h3>
      <p>
        We share personal information with affiliated and unaffiliated service
        providers to help us run our business, including service providers that
        help us: (i) verify your identity or authenticate your identification
        documents, (ii) check information against public databases, (iii)
        conduct background or police checks, fraud prevention, and risk
        assessment, (iv) perform product development, maintenance and debugging,
        (v) allow the provision of the Woo Woo Network Services through
        third-party platforms and software tools (e.g. through the integration
        with our APIs), (vi) provide customer service, advertising, or payments
        services, (vii) process, handle or assess insurance claims or similar
        claims. These providers are contractually bound to protect your personal
        information and have access to your personal information to perform
        these tasks.
      </p>
      <h3>4.9 Business Transfers.</h3>
      <p>
        If Woo Woo Network undertakes or is involved in any merger, acquisition,
        reorganization, sale of assets, bankruptcy, or insolvency event, then we
        may sell, transfer or share some or all of our assets, including your
        information in connection with such transaction or in contemplation of
        such transaction (e.g., due diligence). In this event, we will notify
        you before your personal information is transferred and becomes subject
        to a different privacy policy.
      </p>
      <h3>4.10 Corporate Affiliates.</h3>
      <p>
        To support us in providing, integrating, promoting and improving the Woo
        Woo Network Platform, Payment Services, and our affiliates’ services, we
        may share personal information within our corporate family of companies
        that are related by common ownership or control. Some examples are:
      </p>
      <ul>
        <li>
          <p>
            <strong>Sharing with BEING LOVE Inc.</strong> Even if your country
            of residence is not the Canada, your information will be shared with
            <strong>BEING LOVE</strong> Inc. which provides the technical
            infrastructure for the Woo Woo Network Platform.
          </p>
        </li>
        <li>
          <p>
            <strong>Sharing with Woo Woo Network Payments.</strong> In order to
            facilitate payments on or through the Woo Woo Network Platform,
            certain information will be shared with the relevant Woo Woo Network
            Payments entity.
          </p>
        </li>
      </ul>
      <h2>5. OTHER IMPORTANT INFORMATION</h2>
      <h3>5.1 Analyzing your Communications.</h3>
      <p>
        We may review, scan, or analyze your communications on the Woo Woo
        Network Platform for reasons outlined in the “How We Use Information We
        Collect” section of this policy, including fraud prevention, risk
        assessment, regulatory compliance, investigation, product development,
        research, analytics, enforcing our 
        <a
          href="https://www.airbnb.ca/help/article/2908/terms-of-service"
          target="blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
        , and customer support purposes. For example, as part of our fraud
        prevention efforts, we scan and analyze messages to mask contact
        information and references to other sites. In some cases, we may also
        scan, review, or analyze messages to debug, improve, and expand product
        offerings. We use automated methods where reasonably possible.
        Occasionally we may need to manually review communications, such as for
        fraud investigations and customer support, or to assess and improve the
        functionality of these automated tools. We will not review, scan, or
        analyze your messaging communications to send third-party marketing
        messages to you and we will not sell reviews or analyses of these
        communications.
      </p>
      <h3>5.2 Linking Third-Party Accounts.</h3>
      <p>
        You can link your Woo Woo Network account with certain third-party
        services like social networks. Your contacts on these third-party
        services are referred to as “Friends.” When you direct the data sharing
        by creating this link:
      </p>
      <ul>
        <li>
          <p>
            some of the information provided to us from linking accounts may be
            published on your public profile,
          </p>
        </li>
        <li>
          <p>
            your activities on the Woo Woo Network Platform may be displayed to
            your Friends on the Woo Woo Network Platform and/or that third-party
            service,
          </p>
        </li>
        <li>
          <p>
            a link to your public profile on that third-party service may be
            included in your Woo Woo Network public profile,
          </p>
        </li>
        <li>
          <p>
            other Woo Woo Network users may be able to see any Friends that you
            may have in common with them, or that you are a Friend of their
            Friend if applicable,
          </p>
        </li>
        <li>
          <p>
            other Woo Woo Network users may be able to see any schools,
            hometowns or other groups you have in common with them as listed on
            your linked social networking service,
          </p>
        </li>
        <li>
          <p>
            information you provide to us from the linking of your accounts may
            be stored, processed and transmitted for fraud prevention and risk
            assessment purposes, and
          </p>
        </li>
        <li>
          <p>
            publication and display of information that you provide to the Woo
            Woo Network Platform through this linkage is subject to your
            settings and authorizations on the Woo Woo Network Platform and the
            third-party service.
          </p>
        </li>
      </ul>
      <h3>5.3 Third-Party Partners &amp; Integrations.</h3>
      <p>
        Parts of Woo Woo Network may link to third-party services, not owned or
        controlled by Woo Woo Network, such as Google Maps/Earth. Use of these
        services is subject to the privacy policies of those providers, such as 
        <a
          href="https://www.google.com/intl/en_us/help/terms_maps/"
          target="blank"
          rel="noreferrer"
        >
          Google Maps/Earth Additional Terms of Use
        </a>
        , 
        <a
          href="https://policies.google.com/privacy"
          target="blank"
          rel="noreferrer"
        >
          Google Privacy Policy
        </a>
         (see 
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="blank"
          rel="noreferrer"
        >
          here
        </a>
         for more information on how Google uses information), and 
        <a
          href="https://www.citibank.com/tts/sa/tts-privacy-statements/index.html"
          target="blank"
          rel="noreferrer"
        >
          Citi Privacy Policy
        </a>
        . Woo Woo Network does not own or control these third parties and when
        you interact with them you are providing your information to them.
      </p>
      <h2>6. YOUR RIGHTS</h2>
      <p>
        You can exercise any of the rights described in this section consistent
        with applicable law. Please note that we may ask you to verify your
        identity and request before taking further action on your request.
      </p>
      <h3>6.1 Managing Your Information.</h3>
      <p>
        You can access and update some of your personal information through your
        Account settings. If you connected your Woo Woo Network Account to a
        third- party service, like Facebook or Google, you can change your
        settings and unlink from that service in your Account settings. You are
        responsible for keeping your personal information up to date.
      </p>
      <h3>6.2 Data Access and Portability.</h3>
      <p>
        In some jurisdictions, applicable law may entitle you to request certain
        copies of your personal information or information about how we handle
        your personal information, request copies of personal information that
        you have provided to us in a structured, commonly used, and
        machine-readable format, and/or request that we transmit this
        information to another service provider (where technically feasible).
      </p>
      <h2>7. SECURITY</h2>
      <p>
        While no organization can guarantee perfect security, we are
        continuously implementing and updating administrative, technical, and
        physical security measures to help protect your information against
        unauthorized access, loss, destruction, or alteration.
      </p>
      <h2>8. CHANGES TO THIS PRIVACY POLICY</h2>
      <p>
        We reserve the right to modify this Privacy Policy at any time in
        accordance with applicable law. If we do so, we will post the revised
        Privacy Policy and update the “Last Updated” date at the top. In case of
        material changes, we will also provide you with notice of the
        modification by email at least thirty (30) days before the effective
        date. If you disagree with the revised Privacy Policy, you can cancel
        your Account. If you do not cancel your Account before the date the
        revised Privacy Policy becomes effective, your continued access to or
        use of the Woo Woo Network Platform will be subject to the revised
        Privacy Policy.
      </p>
      <h2>9. CONTACT INFORMATION AND RESPONSIBLE WOO WOO NETWORK ENTITIES</h2>
      <p>
        For questions or complaints about this Privacy Policy or Woo Woo
        Network’s handling of personal information (i) If you reside in Canada
        contact Woo Woo Network, Inc., Legal Privacy, 304-2388 Kingsway,
        Vancouver, BC, Canada, V5R5G9
      </p>
      {/*<h1>Privacy Policy</h1>*/}
      {/*<p>Last updated: July 17, 2021</p>
      <p>
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You.
      </p>
      <p>
        We use Your Personal data to provide and improve the Service. By using
        the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy. This Privacy Policy has been
        created with the help of the{' '}
        <a
          href="https://www.privacypolicies.com/privacy-policy-generator/"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy Generator
        </a>
        .
      </p>
      <h1>Interpretation and Definitions</h1>
      <h2>Interpretation</h2>
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>
      <h2>Definitions</h2>
      <p>For the purposes of this Privacy Policy:</p>
      <ul>
        <li>
          <p>
            <strong>Account</strong> means a unique account created for You to
            access our Service or parts of our Service.
          </p>
        </li>
        <li>
          <p>
            <strong>Company</strong> (referred to as either &quot;the
            Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
            this Agreement) refers to The Woo Woo Net.
          </p>
        </li>
        <li>
          <p>
            <strong>Cookies</strong> are small files that are placed on Your
            computer, mobile device or any other device by a website, containing
            the details of Your browsing history on that website among its many
            uses.
          </p>
        </li>
        <li>
          <p>
            <strong>Country</strong> refers to: British Columbia, Canada
          </p>
        </li>
        <li>
          <p>
            <strong>Device</strong> means any device that can access the Service
            such as a computer, a cellphone or a digital tablet.
          </p>
        </li>
        <li>
          <p>
            <strong>Personal Data</strong> is any information that relates to an
            identified or identifiable individual.
          </p>
        </li>
        <li>
          <p>
            <strong>Service</strong> refers to the Website.
          </p>
        </li>
        <li>
          <p>
            <strong>Service Provider</strong> means any natural or legal person
            who processes the data on behalf of the Company. It refers to
            third-party companies or individuals employed by the Company to
            facilitate the Service, to provide the Service on behalf of the
            Company, to perform services related to the Service or to assist the
            Company in analyzing how the Service is used.
          </p>
        </li>
        <li>
          <p>
            <strong>Usage Data</strong> refers to data collected automatically,
            either generated by the use of the Service or from the Service
            infrastructure itself (for example, the duration of a page visit).
          </p>
        </li>
        <li>
          <p>
            <strong>Website</strong> refers to The Woo Woo Net, accessible from{' '}
            <a
              href="http://www.thewoowoo.net"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              http://www.thewoowoo.net
            </a>
          </p>
        </li>
        <li>
          <p>
            <strong>You</strong> means the individual accessing or using the
            Service, or the company, or other legal entity on behalf of which
            such individual is accessing or using the Service, as applicable.
          </p>
        </li>
      </ul>
      <h1>Collecting and Using Your Personal Data</h1>
      <h2>Types of Data Collected</h2>
      <h3>Personal Data</h3>
      <p>
        While using Our Service, We may ask You to provide Us with certain
        personally identifiable information that can be used to contact or
        identify You. Personally identifiable information may include, but is
        not limited to:
      </p>
      <ul>
        <li>
          <p>Email address</p>
        </li>
        <li>
          <p>First name and last name</p>
        </li>
        <li>
          <p>Address, State, Province, ZIP/Postal code, City</p>
        </li>
        <li>
          <p>Usage Data</p>
        </li>
      </ul>
      <h3>Usage Data</h3>
      <p>Usage Data is collected automatically when using the Service.</p>
      <p>
        Usage Data may include information such as Your Device&apos;s Internet
        Protocol address (e.g. IP address), browser type, browser version, the
        pages of our Service that You visit, the time and date of Your visit,
        the time spent on those pages, unique device identifiers and other
        diagnostic data.
      </p>
      <p>
        When You access the Service by or through a mobile device, We may
        collect certain information automatically, including, but not limited
        to, the type of mobile device You use, Your mobile device unique ID, the
        IP address of Your mobile device, Your mobile operating system, the type
        of mobile Internet browser You use, unique device identifiers and other
        diagnostic data.
      </p>
      <p>
        We may also collect information that Your browser sends whenever You
        visit our Service or when You access the Service by or through a mobile
        device.
      </p>
      <h3>Tracking Technologies and Cookies</h3>
      <p>
        We use Cookies and similar tracking technologies to track the activity
        on Our Service and store certain information. Tracking technologies used
        are beacons, tags, and scripts to collect and track information and to
        improve and analyze Our Service. The technologies We use may include:
      </p>
      <ul>
        <li>
          <strong>Cookies or Browser Cookies.</strong> A cookie is a small file
          placed on Your Device. You can instruct Your browser to refuse all
          Cookies or to indicate when a Cookie is being sent. However, if You do
          not accept Cookies, You may not be able to use some parts of our
          Service. Unless you have adjusted Your browser setting so that it will
          refuse Cookies, our Service may use Cookies.
        </li>
        <li>
          <strong>Flash Cookies.</strong> Certain features of our Service may
          use local stored objects (or Flash Cookies) to collect and store
          information about Your preferences or Your activity on our Service.
          Flash Cookies are not managed by the same browser settings as those
          used for Browser Cookies. For more information on how You can delete
          Flash Cookies, please read &quot;Where can I change the settings for
          disabling, or deleting local shared objects?&quot; available at{' '}
          <a
            href="https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_"
            rel="external nofollow noopener noreferrer"
            target="_blank"
          >
            https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_
          </a>
        </li>
        <li>
          <strong>Web Beacons.</strong> Certain sections of our Service and our
          emails may contain small electronic files known as web beacons (also
          referred to as clear gifs, pixel tags, and single-pixel gifs) that
          permit the Company, for example, to count users who have visited those
          pages or opened an email and for other related website statistics (for
          example, recording the popularity of a certain section and verifying
          system and server integrity).
        </li>
      </ul>
      <p>
        Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies.
        Persistent Cookies remain on Your personal computer or mobile device
        when You go offline, while Session Cookies are deleted as soon as You
        close Your web browser. Learn more about cookies:{' '}
        <a
          href="https://www.privacypolicies.com/blog/cookies/"
          target="_blank"
          rel="noreferrer"
        >
          What Are Cookies?
        </a>
        .
      </p>
      <p>
        We use both Session and Persistent Cookies for the purposes set out
        below:
      </p>
      <ul>
        <li>
          <p>
            <strong>Necessary / Essential Cookies</strong>
          </p>
          <p>Type: Session Cookies</p>
          <p>Administered by: Us</p>
          <p>
            Purpose: These Cookies are essential to provide You with services
            available through the Website and to enable You to use some of its
            features. They help to authenticate users and prevent fraudulent use
            of user accounts. Without these Cookies, the services that You have
            asked for cannot be provided, and We only use these Cookies to
            provide You with those services.
          </p>
        </li>
        <li>
          <p>
            <strong>Cookies Policy / Notice Acceptance Cookies</strong>
          </p>
          <p>Type: Persistent Cookies</p>
          <p>Administered by: Us</p>
          <p>
            Purpose: These Cookies identify if users have accepted the use of
            cookies on the Website.
          </p>
        </li>
        <li>
          <p>
            <strong>Functionality Cookies</strong>
          </p>
          <p>Type: Persistent Cookies</p>
          <p>Administered by: Us</p>
          <p>
            Purpose: These Cookies allow us to remember choices You make when
            You use the Website, such as remembering your login details or
            language preference. The purpose of these Cookies is to provide You
            with a more personal experience and to avoid You having to re-enter
            your preferences every time You use the Website.
          </p>
        </li>
      </ul>
      <p>
        For more information about the cookies we use and your choices regarding
        cookies, please visit our Cookies Policy or the Cookies section of our
        Privacy Policy.
      </p>
      <h2>Use of Your Personal Data</h2>
      <p>The Company may use Personal Data for the following purposes:</p>
      <ul>
        <li>
          <p>
            <strong>To provide and maintain our Service</strong>, including to
            monitor the usage of our Service.
          </p>
        </li>
        <li>
          <p>
            <strong>To manage Your Account:</strong> to manage Your registration
            as a user of the Service. The Personal Data You provide can give You
            access to different functionalities of the Service that are
            available to You as a registered user.
          </p>
        </li>
        <li>
          <p>
            <strong>For the performance of a contract:</strong> the development,
            compliance and undertaking of the purchase contract for the
            products, items or services You have purchased or of any other
            contract with Us through the Service.
          </p>
        </li>
        <li>
          <p>
            <strong>To contact You:</strong> To contact You by email, telephone
            calls, SMS, or other equivalent forms of electronic communication,
            such as a mobile application&apos;s push notifications regarding
            updates or informative communications related to the
            functionalities, products or contracted services, including the
            security updates, when necessary or reasonable for their
            implementation.
          </p>
        </li>
        <li>
          <p>
            <strong>To provide You</strong> with news, special offers and
            general information about other goods, services and events which we
            offer that are similar to those that you have already purchased or
            enquired about unless You have opted not to receive such
            information.
          </p>
        </li>
        <li>
          <p>
            <strong>To manage Your requests:</strong> To attend and manage Your
            requests to Us.
          </p>
        </li>
        <li>
          <p>
            <strong>For business transfers:</strong> We may use Your information
            to evaluate or conduct a merger, divestiture, restructuring,
            reorganization, dissolution, or other sale or transfer of some or
            all of Our assets, whether as a going concern or as part of
            bankruptcy, liquidation, or similar proceeding, in which Personal
            Data held by Us about our Service users is among the assets
            transferred.
          </p>
        </li>
        <li>
          <p>
            <strong>For other purposes</strong>: We may use Your information for
            other purposes, such as data analysis, identifying usage trends,
            determining the effectiveness of our promotional campaigns and to
            evaluate and improve our Service, products, services, marketing and
            your experience.
          </p>
        </li>
      </ul>
      <p>We may share Your personal information in the following situations:</p>
      <ul>
        <li>
          <strong>With Service Providers:</strong> We may share Your personal
          information with Service Providers to monitor and analyze the use of
          our Service, to contact You.
        </li>
        <li>
          <strong>For business transfers:</strong> We may share or transfer Your
          personal information in connection with, or during negotiations of,
          any merger, sale of Company assets, financing, or acquisition of all
          or a portion of Our business to another company.
        </li>
        <li>
          <strong>With Affiliates:</strong> We may share Your information with
          Our affiliates, in which case we will require those affiliates to
          honor this Privacy Policy. Affiliates include Our parent company and
          any other subsidiaries, joint venture partners or other companies that
          We control or that are under common control with Us.
        </li>
        <li>
          <strong>With business partners:</strong> We may share Your information
          with Our business partners to offer You certain products, services or
          promotions.
        </li>
        <li>
          <strong>With other users:</strong> when You share personal information
          or otherwise interact in the public areas with other users, such
          information may be viewed by all users and may be publicly distributed
          outside.
        </li>
        <li>
          <strong>With Your consent</strong>: We may disclose Your personal
          information for any other purpose with Your consent.
        </li>
      </ul>
      <h2>Retention of Your Personal Data</h2>
      <p>
        The Company will retain Your Personal Data only for as long as is
        necessary for the purposes set out in this Privacy Policy. We will
        retain and use Your Personal Data to the extent necessary to comply with
        our legal obligations (for example, if we are required to retain your
        data to comply with applicable laws), resolve disputes, and enforce our
        legal agreements and policies.
      </p>
      <p>
        The Company will also retain Usage Data for internal analysis purposes.
        Usage Data is generally retained for a shorter period of time, except
        when this data is used to strengthen the security or to improve the
        functionality of Our Service, or We are legally obligated to retain this
        data for longer time periods.
      </p>
      <h2>Transfer of Your Personal Data</h2>
      <p>
        Your information, including Personal Data, is processed at the
        Company&apos;s operating offices and in any other places where the
        parties involved in the processing are located. It means that this
        information may be transferred to — and maintained on — computers
        located outside of Your state, province, country or other governmental
        jurisdiction where the data protection laws may differ than those from
        Your jurisdiction.
      </p>
      <p>
        Your consent to this Privacy Policy followed by Your submission of such
        information represents Your agreement to that transfer.
      </p>
      <p>
        The Company will take all steps reasonably necessary to ensure that Your
        data is treated securely and in accordance with this Privacy Policy and
        no transfer of Your Personal Data will take place to an organization or
        a country unless there are adequate controls in place including the
        security of Your data and other personal information.
      </p>
      <h2>Disclosure of Your Personal Data</h2>
      <h3>Business Transactions</h3>
      <p>
        If the Company is involved in a merger, acquisition or asset sale, Your
        Personal Data may be transferred. We will provide notice before Your
        Personal Data is transferred and becomes subject to a different Privacy
        Policy.
      </p>
      <h3>Law enforcement</h3>
      <p>
        Under certain circumstances, the Company may be required to disclose
        Your Personal Data if required to do so by law or in response to valid
        requests by public authorities (e.g. a court or a government agency).
      </p>
      <h3>Other legal requirements</h3>
      <p>
        The Company may disclose Your Personal Data in the good faith belief
        that such action is necessary to:
      </p>
      <ul>
        <li>Comply with a legal obligation</li>
        <li>Protect and defend the rights or property of the Company</li>
        <li>
          Prevent or investigate possible wrongdoing in connection with the
          Service
        </li>
        <li>
          Protect the personal safety of Users of the Service or the public
        </li>
        <li>Protect against legal liability</li>
      </ul>
      <h2>Security of Your Personal Data</h2>
      <p>
        The security of Your Personal Data is important to Us, but remember that
        no method of transmission over the Internet, or method of electronic
        storage is 100% secure. While We strive to use commercially acceptable
        means to protect Your Personal Data, We cannot guarantee its absolute
        security.
      </p>
      <h1>Children&apos;s Privacy</h1>
      <p>
        Our Service does not address anyone under the age of 13. We do not
        knowingly collect personally identifiable information from anyone under
        the age of 13. If You are a parent or guardian and You are aware that
        Your child has provided Us with Personal Data, please contact Us. If We
        become aware that We have collected Personal Data from anyone under the
        age of 13 without verification of parental consent, We take steps to
        remove that information from Our servers.
      </p>
      <p>
        If We need to rely on consent as a legal basis for processing Your
        information and Your country requires consent from a parent, We may
        require Your parent&apos;s consent before We collect and use that
        information.
      </p>
      <h1>Links to Other Websites</h1>
      <p>
        Our Service may contain links to other websites that are not operated by
        Us. If You click on a third party link, You will be directed to that
        third party&apos;s site. We strongly advise You to review the Privacy
        Policy of every site You visit.
      </p>
      <p>
        We have no control over and assume no responsibility for the content,
        privacy policies or practices of any third party sites or services.
      </p>
      <h1>Changes to this Privacy Policy</h1>
      <p>
        We may update Our Privacy Policy from time to time. We will notify You
        of any changes by posting the new Privacy Policy on this page.
      </p>
      <p>
        We will let You know via email and/or a prominent notice on Our Service,
        prior to the change becoming effective and update the &quot;Last
        updated&quot; date at the top of this Privacy Policy.
      </p>
      <p>
        You are advised to review this Privacy Policy periodically for any
        changes. Changes to this Privacy Policy are effective when they are
        posted on this page.
      </p>
      <h1>Contact Us</h1>
      <p>
        If you have any questions about this Privacy Policy, You can contact us:
      </p>
      <ul>
        <li>By email: thewoowoonet@gmail.com</li>
      </ul>*/}
    </div>
  );
};

const PrivacyPolicy = (props) => {
  const classes = props;

  return (
    <div>
      <Paper className={`${classes.Paper} ${globalStyles.defPgContainer}`}>
        <CssBaseline />
        <div className={`${globalStyles.centerItems}`}>
          <PageTitle align="center" contents="Privacy Policy" />
          <PageContent />
        </div>
      </Paper>
      <Copyright />
    </div>
  );
};
PrivacyPolicy.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default PrivacyPolicy;
