import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import SettingsClient from "@/components/settings/SettingsClient"
const { Settings } = require("@/models")

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const settings = await Settings.findOne();

  return <SettingsClient settings={JSON.parse(JSON.stringify(settings))} />
} 