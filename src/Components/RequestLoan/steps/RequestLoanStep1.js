import React from "react";

import { makeStyles } from "@material-ui/styles";

import NftInfoCard from "../../Common/NFTComponents/NftInfoCard";
import { Stack, Text } from "degen";

const RequestLoanStep1 = ({
  nftData,
  loading,
  setSelectedNftIndex,
  setCurrentStep,
}) => {
  const classes = useStyles();

  if (loading || nftData?.length == 0)
    return (
      <>
        <Text variant="large" weight="medium">
          Select a NFT to create loan
        </Text>
        <div style={{ marginTop: "1rem" }}>
          <Stack direction="horizontal">
            <NftInfoCard onCardClick={() => {}} loading />
            <NftInfoCard onCardClick={() => {}} loading />
            <NftInfoCard onCardClick={() => {}} loading />
          </Stack>
        </div>
      </>
    );

  return (
    <div>
      <Text variant="large" weight="medium">
        Select a NFT to create loan
      </Text>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {nftData?.length > 0 &&
          nftData.map((nft, index) => {
            return (
              <NftInfoCard
                key={index}
                url={nft.data.data.image}
                name={nft.data.data.name}
                description={nft.data.data.description}
                index={index}
                onCardClick={() => {
                  setCurrentStep(1);
                  setSelectedNftIndex(index);
                }}
                loading={false}
              />
            );
          })}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default RequestLoanStep1;
