/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { SendMessageToChannel } from "../../../common/utils/channel/message-to-channel-injection-token";
import { sendMessageToChannelInjectionToken } from "../../../common/utils/channel/message-to-channel-injection-token";
import getVisibleWindowsInjectable from "../../start-main-application/lens-window/get-visible-windows.injectable";
import clusterFramesInjectable from "../../../common/cluster-frames.injectable";

const messageToChannelInjectable = getInjectable({
  id: "message-to-channel",

  instantiate: (di) => {
    const getVisibleWindows = di.inject(getVisibleWindowsInjectable);
    const clusterFrames = di.inject(clusterFramesInjectable);

    return ((channel, data) => {
      for (const window of getVisibleWindows()) {
        window.send({ channel: channel.id, data });

        clusterFrames.forEach(frameInfo => {
          window.send({ channel: channel.id, data, frameInfo });
        });
      }
    }) as SendMessageToChannel;
  },

  injectionToken: sendMessageToChannelInjectionToken,
});

export default messageToChannelInjectable;
