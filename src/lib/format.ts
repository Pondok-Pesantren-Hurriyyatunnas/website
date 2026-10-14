import { getCollection } from 'astro:content';

export const formatDate = (date: Date) =>
  date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// Berita yang sudah terbit (bukan draft), terbaru di atas
export const getPublishedNews = async () =>
  (await getCollection('news', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
