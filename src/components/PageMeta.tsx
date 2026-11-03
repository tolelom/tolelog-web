// react-helmet-async 를 직접 쓰지 않고 vite-react-ssg 의 Head 를 써야 prerender 한 HTML 의 <head> 에 들어간다.
import { Head as Helmet } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/constants';
import { absoluteSiteUrl } from '../lib/siteUrl';

type OgType = 'website' | 'article' | 'profile';

interface PageMetaProps {
    // 비우면 사이트 이름만 쓴다.
    title?: string;
    description?: string;
    // 비우면 지금 경로를 쓴다. 쿼리를 지운 대표 주소를 주려면 넘긴다.
    canonical?: string;
    ogImage?: string;
    ogType?: OgType;
    noindex?: boolean;
    locale?: string;
    // ogType 이 article 일 때만 쓴다.
    article?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string;
        tags?: string[];
    };
}

export default function PageMeta({
    title,
    description = SITE_DESCRIPTION,
    canonical,
    ogImage,
    ogType = 'website',
    noindex = false,
    locale = 'ko_KR',
    article,
}: PageMetaProps) {
    const { pathname } = useLocation();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = absoluteSiteUrl(canonical ?? pathname);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {noindex && <meta name="robots" content="noindex,nofollow" />}

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:locale" content={locale} />
            {ogImage && <meta property="og:image" content={absoluteSiteUrl(ogImage)} />}

            <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={absoluteSiteUrl(ogImage)} />}

            {ogType === 'article' && article?.publishedTime && (
                <meta property="article:published_time" content={article.publishedTime} />
            )}
            {ogType === 'article' && article?.modifiedTime && (
                <meta property="article:modified_time" content={article.modifiedTime} />
            )}
            {ogType === 'article' && article?.author && (
                <meta property="article:author" content={article.author} />
            )}
            {ogType === 'article' && article?.tags?.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}
        </Helmet>
    );
}
