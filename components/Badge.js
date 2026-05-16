'use client';
import { badgeClass } from '../utils/helpers';

export default function Badge({ texto }) {
  return <span className={`badge ${badgeClass(String(texto))}`}>{texto}</span>;
}
