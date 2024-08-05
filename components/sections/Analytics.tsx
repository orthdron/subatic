import Script from 'next/script';

const validateEnvVariables = () => {
    const variables = {
        ENABLE_UMAMI: process.env.ENABLE_UMAMI,
        UMAMI_URL: process.env.UMAMI_URL,
        UMAMI_ID: process.env.UMAMI_ID,
        ENABLE_PLAUSIBLE: process.env.ENABLE_PLAUSIBLE,
        PLAUSIBLE_HOST: process.env.PLAUSIBLE_HOST,
        PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN,
        ENABLE_GOOGLE_ANALYTICS: process.env.ENABLE_GOOGLE_ANALYTICS,
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    };


    if (variables.ENABLE_UMAMI === 'true') {
        if (!variables.UMAMI_URL || !variables.UMAMI_ID) {
            console.warn('Umami is enabled but UMAMI_URL or UMAMI_ID is missing.');
        }
    }

    if (variables.ENABLE_PLAUSIBLE === 'true') {
        if (!variables.PLAUSIBLE_HOST || !variables.PLAUSIBLE_DOMAIN) {
            console.warn('Plausible is enabled but PLAUSIBLE_HOST or PLAUSIBLE_DOMAIN is missing.');
        }
    }

    if (variables.ENABLE_GOOGLE_ANALYTICS === 'true') {
        if (!variables.GOOGLE_ANALYTICS_ID) {
            console.warn('Google Analytics is enabled but GOOGLE_ANALYTICS_ID is missing.');
        }
    }
};

export default async function Analytics() {
    validateEnvVariables();

    const enableUmami = process.env.ENABLE_UMAMI === 'true';
    const umamiUrl = process.env.UMAMI_URL;
    const umamiId = process.env.UMAMI_ID;

    const enablePlausible = process.env.ENABLE_PLAUSIBLE === 'true';
    const plausibleHost = process.env.PLAUSIBLE_HOST;
    const plausibleDomain = process.env.PLAUSIBLE_DOMAIN;

    const enableGoogleAnalytics = process.env.ENABLE_GOOGLE_ANALYTICS === 'true';
    const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

    return (
        <>
            {enableUmami && umamiUrl && umamiId && (
                <Script
                    async
                    src={`${umamiUrl}/script.js`}
                    data-website-id={umamiId}
                />
            )}
            {enablePlausible && plausibleDomain && plausibleHost && (
                <Script
                    async
                    defer
                    data-domain={plausibleDomain}
                    src={`${plausibleHost}/js/script.js`}
                />
            )}
            {enableGoogleAnalytics && googleAnalyticsId && (
                <>
                    <Script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
                    />
                    <Script id="google-analytics">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${googleAnalyticsId}');
                        `}
                    </Script>
                </>
            )}
        </>
    );
}