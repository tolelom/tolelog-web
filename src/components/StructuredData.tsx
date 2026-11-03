import { Head as Helmet } from 'vite-react-ssg';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/constants';
import { absoluteSiteUrl } from '../lib/siteUrl';

function jsonLd(data: object): string {
    // 제목에 </script> 가 들어 있어도 스크립트 태그를 닫지 못하게 < 를 이스케이프한다.
    return JSON.stringify(data).replace(/</g, '\\u003c');
}

interface ArticleJsonLdProps {
    url: string;
    title: string;
    description: string;
    authorName: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    tags?: string[];
}

export function ArticleJsonLd({
    url,
    title,
    description,
    authorName,
    datePublished,
    dateModified,
    image,
    tags,
}: ArticleJsonLdProps) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        url: absoluteSiteUrl(url),
        mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteSiteUrl(url) },
        author: { '@type': 'Person', name: authorName },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        datePublished,
        dateModified: dateModified ?? datePublished,
        ...(image ? { image: absoluteSiteUrl(image) } : {}),
        ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
    };

    return (
        <Helmet>
            <script type="application/ld+json">{jsonLd(data)}</script>
        </Helmet>
    );
}

interface BlogJsonLdProps {
    description?: string;
}

export function BlogJsonLd({ description = SITE_DESCRIPTION }: BlogJsonLdProps = {}) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: SITE_NAME,
        description,
        url: SITE_URL,
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    };

    return (
        <Helmet>
            <script type="application/ld+json">{jsonLd(data)}</script>
        </Helmet>
    );
}

export interface BreadcrumbItem {
    name: string;
    // 마지막 항목(현재 페이지)도 URL 을 넣는다.
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    if (items.length === 0) return null;

    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: absoluteSiteUrl(item.url),
        })),
    };

    return (
        <Helmet>
            <script type="application/ld+json">{jsonLd(data)}</script>
        </Helmet>
    );
}
