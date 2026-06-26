"use client"

import { requestWithAuth } from "./api-client"
import type { ProfileDocument } from "./profileDocuments"

/**
 * Public-facing documents for another user, used by the discovery/match section.
 * Returns only the user's active-role documents, normalized with file key/url so
 * they can be opened through a signed-read URL.
 */
export async function getProfileDocumentsByUserId(userId: string) {
  const data = await requestWithAuth<{ documents?: ProfileDocument[] }>(
    `/profiles/user/${encodeURIComponent(userId)}/documents`,
    { expectEnvelope: false },
  )
  return data.documents ?? []
}
