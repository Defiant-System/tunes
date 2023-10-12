<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sample-view">
	<div class="sample-view" data-area="sample">
		<h2>Welcome to Tunes.</h2>

		<div class="block-buttons">
			<div class="btn" data-click="open-filesystem">
				<i class="icon-folder-open"></i>
				Open&#8230;
			</div>

			<div class="btn disabled_" data-click="from-upload">
				<i class="icon-upload"></i>
				Upload
			</div>
		</div>

		<div class="sample-block">
			<xsl:call-template name="sample-list">
				<xsl:with-param name="node" select="//Cdn" />
			</xsl:call-template>
		</div>
	</div>
</xsl:template>


<xsl:template name="sample-list">
	<xsl:param name="node"/>
	<div class="table">
		<div class="row head">
			<div class="cell"></div>
			<div class="cell">Title</div>
			<div class="cell">Artist</div>
			<div class="cell"></div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body" data-click="select-track" data-dbl-click="handle-dbl-click">
			<xsl:for-each select="$node/*">
				<div class="row" data-ondrag="check-track-drag" data-context="playlist-track">
					<xsl:attribute name="data-_id"><xsl:value-of select="@_id"/></xsl:attribute>
					<div class="cell">
						<i class="icon-play" data-click="play-song"></i>
						<i class="icon-heart" data-click="toggle-heart"></i>
					</div>
					<div class="cell"><xsl:value-of select="@name"/></div>
					<div class="cell"><xsl:value-of select="@artist"/></div>
					<div class="cell">
						<i class="icon-bars">
							<xsl:attribute name="style">--clip: inset(0 0 0 <xsl:value-of select="floor( 31 * ( @popularity div 100 ) )"/>px);</xsl:attribute>
						</i>
					</div>
					<div class="cell"><xsl:if test="@dur">
						<xsl:call-template name="translate-duration">
							<xsl:with-param name="ms" select="@dur" />
						</xsl:call-template>
					</xsl:if></div>
				</div>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="sidebar">
	<div>
		<legend>
			Playlists
			<span class="btn-toggle" data-click="toggle-block" toggle-text="Show">Hide</span>
		</legend>
		<div class="list-wrapper user-list" data-click="select-playlist">
			<xsl:call-template name="render-sidebar-list">
				<xsl:with-param name="xParent" select="./Playlists" />
				<xsl:with-param name="drag" select="1" />
			</xsl:call-template>
			<div class="new-playlist" data-click="add-new-playlist">
				<i class="icon-plus"></i>
				<span class="name">Add Playlist</span>
			</div>
		</div>

		<legend>
			System
			<span class="btn-toggle" data-click="toggle-block" toggle-text="Show">Hide</span>
		</legend>
		<div class="list-wrapper system-list" data-click="select-playlist">
			<xsl:call-template name="render-sidebar-list">
				<xsl:with-param name="xParent" select="./System" />
				<xsl:with-param name="drag" select="0" />
			</xsl:call-template>
		</div>
	</div>
</xsl:template>


<xsl:template name="render-sidebar-leaf">
	<xsl:call-template name="render-sidebar-list">
		<xsl:with-param name="xParent" select="." />
		<xsl:with-param name="drag" select="1" />
	</xsl:call-template>
</xsl:template>


<xsl:template name="render-sidebar-list">
	<xsl:param name="xParent"/>
	<xsl:param name="drag"/>
	<ul>
		<xsl:for-each select="$xParent/*">
			<xsl:call-template name="render-sidebar-item">
				<xsl:with-param name="drag" select="$drag" />
			</xsl:call-template>
		</xsl:for-each>
	</ul>
</xsl:template>


<xsl:template name="render-sidebar-item">
	<xsl:param name="drag" select="1"/>
	<li>
		<xsl:attribute name="data-_id"><xsl:value-of select="@_id"/></xsl:attribute>
		<xsl:if test="count(./i[@name])"><xsl:attribute name="class">has-children</xsl:attribute></xsl:if>
		<xsl:if test="@xpath">
			<xsl:attribute name="data-xpath"><xsl:value-of select="@xpath"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="$drag = 1">
			<xsl:attribute name="data-ondrag">check-playlist-drag</xsl:attribute>
			<xsl:attribute name="data-context">user-playlist</xsl:attribute>
		</xsl:if>
		<div class="leaf">
			<i class="icon-blank" data-click="toggle-folder">
				<xsl:if test="count(./i[@name])"><xsl:attribute name="class">icon-arrow</xsl:attribute></xsl:if>
			</i>
			<i class="icon-folder">
				<xsl:if test="@icon"><xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute></xsl:if>
			</i>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
		<div class="children"></div>
	</li>
</xsl:template>


<xsl:template name="playlist-rename">
	<div class="rename-field">
		<input type="text" name="playlist-rename" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
	</div>
</xsl:template>


<xsl:template name="content-list">
	<div class="playlist-info">
		<xsl:attribute name="data-_id"><xsl:value-of select="@_id"/></xsl:attribute>
		<h2><xsl:value-of select="@artist"/> - <xsl:value-of select="@album"/></h2>
		<ul class="details">
			<li><xsl:choose>
				<xsl:when test="@owner = 'me'"><xsl:value-of select="//Settings/User/@name"/></xsl:when>
				<xsl:otherwise>System</xsl:otherwise>
			</xsl:choose></li>
			<li><xsl:value-of select="count(.//*)"/> songs</li>
			<li><xsl:call-template name="summarize-duration">
				<xsl:with-param name="ms" select="sum(.//@dur)"/>
			</xsl:call-template></li>
		</ul>
	</div>
	<div class="table">
		<xsl:if test="not(@owner)"><xsl:attribute name="class">table enum</xsl:attribute></xsl:if>
		<div class="row head">
			<div class="cell"></div>
			<div class="cell sort-asc1">Title</div>
			<div class="cell">Artist</div>
			<div class="cell">Album</div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body" data-click="select-track" data-dbl-click="handle-dbl-click">
			<xsl:attribute name="data-_id"><xsl:value-of select="@_id"/></xsl:attribute>
			<xsl:for-each select="./*">
				<xsl:sort order="descending" select="@lp"/>
				<xsl:if test="position() &lt;= //Data/AllFiles/@limit">
					<xsl:variable name="currId" select="current()/@ref | current()/@id"/>
					<xsl:variable name="song" select="//Data/AllFiles/*[@id = $currId]"/>
					<div class="row" data-ondrag="check-track-drag" data-context="playlist-track">
						<xsl:attribute name="data-pos"><xsl:value-of select="position()"/></xsl:attribute>
						<xsl:attribute name="data-_id"><xsl:value-of select="@_id"/></xsl:attribute>
						<div class="cell">
							<i class="icon-play" data-click="play-song"></i>
							<i class="icon-heart" data-click="toggle-heart">
								<xsl:if test="$song/@fav = 1">
									<xsl:attribute name="class">icon-heart-full</xsl:attribute>
								</xsl:if>
							</i>
						</div>
						<div class="cell">
							<xsl:choose>
								<xsl:when test="$song/@title"><xsl:value-of select="$song/@title"/></xsl:when>
								<xsl:otherwise><xsl:value-of select="$song/@name"/></xsl:otherwise>
							</xsl:choose>
						</div>
						<div class="cell">
							<xsl:value-of select="$song/@artist"/>
						</div>
						<div class="cell">
							<xsl:choose>
								<xsl:when test="$song/@album"><xsl:value-of select="$song/@album"/></xsl:when>
								<xsl:otherwise><xsl:value-of select="../@album"/></xsl:otherwise>
							</xsl:choose>
						</div>
						<div class="cell"><xsl:if test="$song/@dur">
							<xsl:call-template name="translate-duration">
								<xsl:with-param name="ms" select="$song/@dur" />
							</xsl:call-template>
						</xsl:if></div>
					</div>
				</xsl:if>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="translate-duration">
	<xsl:param name="ms"/>
	<xsl:variable name="minutes" select="floor( floor( $ms div 1000 ) div 60) mod 60"/>
	<xsl:variable name="seconds" select="round( $ms div 1000 ) mod 60"/>
	<xsl:value-of select="format-number($minutes, '0')"/>
	<xsl:value-of select="format-number($seconds, ':00')"/>
</xsl:template>


<xsl:template name="summarize-duration">
	<xsl:param name="ms"/>
	<xsl:variable name="hours" select="floor( floor( floor( $ms div 1000 ) div 60) div 60) mod 60"/>
	<xsl:variable name="minutes" select="floor( floor( $ms div 1000 ) div 60) mod 60"/>
	<xsl:value-of select="format-number($hours, '0 h ')"/>
	<xsl:value-of select="format-number($minutes, '0 min')"/>
</xsl:template>

</xsl:stylesheet>