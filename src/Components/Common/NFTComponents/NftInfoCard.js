import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Text, SkeletonGroup, Skeleton, IconArrowRight, Tag } from "degen";

import { ORDER_STATUS } from "../../../constants/constants";

const NftInfoCard = ({
  url,
  name = "",
  description = "",
  loading = false,
  index,
  onCardClick,
  children,
  orderStatus = "",
}) => {
  const classes = useStyles();

  const getTagColor = (status) => {
    let color = "secondary";

    if (status === ORDER_STATUS.OPEN) color = "green";
    else if (status === ORDER_STATUS.PROCESSED) color = "accent";
    else if (status === ORDER_STATUS.DEFAULTED) color = "red";
    else color = "secondary";

    return color;
  };

  return (
    <div style={{ cursor: !onCardClick ? "hand" : "pointer" }}>
      <SkeletonGroup loading={loading}>
        <div
          key={index}
          className={classes.root}
          onClick={() => {
            onCardClick && onCardClick();
          }}
        >
          <Skeleton width="full" height="max">
            <img
              src={url}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "fill",
                borderTopRightRadius: "16px",
                borderTopLeftRadius: "16px",
              }}
            />
          </Skeleton>

          <div className={classes.container}>
            <div>
              <Skeleton>
                {orderStatus?.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0.8rem",
                      marginTop: "0.2rem",
                      opacity: 1,
                    }}
                  >
                    <Tag tone={getTagColor(orderStatus)} size="small">
                      {orderStatus}
                    </Tag>
                  </div>
                )}
                <Text variant="large" weight="semiBold" color="foreground">
                  {name}
                </Text>

                <Text variant="base" color="foreground">
                  {description}
                </Text>
              </Skeleton>
            </div>
            <div>
              {onCardClick && (
                <Skeleton>
                  <IconArrowRight />
                </Skeleton>
              )}
            </div>
          </div>
          <div style={{ paddingInline: "1rem", paddingBlock: "0.2rem" }}>
            {children}
          </div>
        </div>
      </SkeletonGroup>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "22vw",
    marginRight: 40,
    background: "rgba( 122, 122, 122, 0.30 )",
    backdropFilter: "blur( 5px )",
    WebkitBackdropFilter: "blur( 5px )",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    borderRadius: "16px",
    marginTop: "1.5rem",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
  },
}));

export default NftInfoCard;
