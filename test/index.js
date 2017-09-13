/* global window */
/**
 STM - DealerInformation
 **/

import React, {  PureComponent } from 'react';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import React from 'react';

const PropTypes = require('react').PropTypes;

DealerInformation.propTypes = {
    address: PropTypes.string,
    className: PropTypes.string,
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
    onDealerSite: PropTypes.func,
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
