import Script from 'next/script';

const validateEnvVariables = () => {
    const variables = {
        ENABLE_UMAMI: process.env.NEXT_PUBLIC_ENABLE_UMAMI,
        UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
        UMAMI_ID: process.env.NEXT_PUBLIC_UMAMI_ID,
        ENABLE_PLAUSIBLE: process.env.NEXT_PUBLIC_ENABLE_PLAUSIBLE,
        PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
        PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        ENABLE_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS,
        GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    };

    Object.entries(variables).forEach(([key, value]) => {
        if (value === undefined) {
            console.warn(`Environment variable ${key} is not defined.`);
        }
    });

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

    const enableUmami = process.env.NEXT_PUBLIC_ENABLE_UMAMI === 'true';
    const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
    const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;

    const enablePlausible = process.env.NEXT_PUBLIC_ENABLE_PLAUSIBLE === 'true';
    const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

    const enableGoogleAnalytics = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS === 'true';
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

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