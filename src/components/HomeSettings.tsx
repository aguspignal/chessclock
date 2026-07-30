import { useConfigStore } from "../stores/useConfigStore"
import { useTranslation } from "react-i18next"
import Card, { CardDivider } from "./Card"
import React from "react"
import SegmentedControl from "./SegmentedControl"
import SettingRow from "./SettingRow"

export default function HomeSettings() {
	const { t } = useTranslation()
	const { orientation, setOrientation, withDifferentTimes, toggleWithDifferentTimes } =
		useConfigStore()

	return (
		<Card>
			<SettingRow icon="account-multiple-outline" label={t("configs.clock")}>
				<SegmentedControl
					options={[
						{ value: "shared", label: t("configs.shared") },
						{ value: "per-player", label: t("configs.per-player") },
					]}
					selected={withDifferentTimes ? "per-player" : "shared"}
					onSelect={(value) => {
						if ((value === "per-player") !== withDifferentTimes) {
							toggleWithDifferentTimes()
						}
					}}
				/>
			</SettingRow>

			<CardDivider />

			<SettingRow icon="screen-rotation" label={t("configs.orientation.orientation")}>
				<SegmentedControl
					options={[
						{ value: "Horizontal", icon: "crop-landscape" },
						{ value: "Vertical", icon: "crop-portrait" },
					]}
					selected={orientation}
					onSelect={(value) =>
						setOrientation(value === "Horizontal" ? "Horizontal" : "Vertical")
					}
				/>
			</SettingRow>
		</Card>
	)
}
