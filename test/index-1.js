/* global window */
/**
 STM - DealerInformation
 **/

import React, { PropTypes, PureComponent } from 'react';
import React, { PureComponent, PropTypes } from 'react';

import React, { PropTypes } from 'react';

const PropTypes = require('react').PropTypes;

DealerInformation.propTypes = {
    address: React.PropTypes.string,
    className: React.PropTypes.string,
    dealerSite: PropTypes.shape({Button}.propTypes),
    dealershipName: PropTypes.string,
    distanceAway: PropTypes.string,
    distanceFocusedData: PropTypes.shape({
        icon: PropTypes.string,
        number: PropTypes.string,
        text: PropTypes.string,
        dealerSite: PropTypes.shape({Button}.propTypes)
    }),
    headingState: PropTypes.shape({
        lid: PropTypes.string,
        lpos: PropTypes.string
    }),
    hoursOfOperation: PropTypes.string,
    id: PropTypes.string,
    onDealerSite: React.PropTypes.func,
    onHeadingClick: PropTypes.func,
    phoneNumber: PropTypes.string,
    text: PropTypes.string,
    theme: PropTypes.oneOf(['dark', 'light']),
    variation: PropTypes.oneOf(['full', 'simplified', 'distanceFocused'])
};

DealerInformation.defaultProps = {
    theme: 'light'
};

export default DealerInformation;
